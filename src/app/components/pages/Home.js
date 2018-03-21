/**
 * Home page
 */

import React from "react";
import moment from "moment";
import { inject, observer } from 'mobx-react';
import ListNameForm from "../../components/ListNameForm";
import ListNameSelect from "../../components/ListNameSelect";
import TaskForm from "../../components/TaskForm";
import TaskList from "../../components/TaskList";
import SearchBox from "../../components/SearchBox";
import SearchedTaskList from "../../components/SearchedTaskList";
import CompletedViewSelect from "../../components/CompletedViewSelect";

@inject('commonStore', 'userStore', 'listRegistryStore', 'interfaceStore')
@observer
export default class Home extends React.Component {

  /**
   * Load our data
   * If a listId is passed through URL params, make sure that list is selected
   * for display
   */
  componentDidMount() {
    if (this.props.userStore.currentUser){
      this.props.listRegistryStore.loadLists()
        .then(() => {
          if (!this.props.listRegistryStore.listRegistry.has(this.props.match.params.listId)){
            this.props.listRegistryStore.errors = "Cannot load this list as it doesn't exist.";
            this.props.history.push("/");
          }
          else {
            this.props.listRegistryStore.loadCurrentList(this.props.match.params.listId);
          }
        });
    }
  }

  /***************************
   *
   * List methods
   *
   ***************************/

  /**
   * Assign the registry value for changing the list name via the input box
   * @param ev
   */
  handleChangeListName = (ev) => {
    this.props.listRegistryStore.currentList.listname = ev.target.value;
  };

  /**
   * Handle adding a new list, assigning the registry value from an input box
   * @param ev
   */
  handleChangeNewListName = (ev) => {
    this.props.listRegistryStore.newListName = ev.target.value;
  };

  /**
   * When you add a new list, you have the option to switch directly to it (via a checkbox)
   * Handle the checking / unchecking of that box
   * @param ev
   */
  handleChangeSwitchToList = (ev) => {
    this.props.interfaceStore.switchToList = !this.props.interfaceStore.switchToList;
  };

  /**
   * Handle saving a list - either editing or creating
   * @param ev
   */
  handleSaveList = (ev) => {
    ev.preventDefault();

    // do not allow saving if the fields are blank
    // visual differentiation on the save button would be handy...
    const listname = this.props.listRegistryStore.newListName || this.props.listRegistryStore.currentList.listname;
    if (listname === ""){
      return false;
    }

    this.props.listRegistryStore.saveList()
      // this isn't loading when I expect; needs sorting out!
      .then(() => {
        if (this.props.switchToList && this.props.listRegistryStore.newListId){
          this.props.history.push("/list/" + this.props.listRegistryStore.newListId);
          this.props.listRegistryStore.newListId = undefined;
        }
      });
  };

  /**
   * When you change the select box of your list options, handle changing
   * to that list
   * @param ev
   */
  handleChangeListSelect = (ev) => {
    const listId = ev.target.value;
    this.props.listRegistryStore.loadCurrentList(listId);
    if (listId !== ""){
      this.props.history.push("/list/" + listId);
    }
    else {
      this.props.history.push("/");
    }
  };

  /**
   * Handle the interface and deletion of a list
   * @param ev
   */
  handleDeleteList = (ev) => {
    ev.preventDefault();
    if (confirm("Deleting a list will remove ALL it's tasks as well!")){
      const listId = this.props.listRegistryStore.currentList.listId;
      this.props.listRegistryStore.deleteList(listId)
        .then(() => {
          this.props.history.push("/");
        });
    }
  };

  /***************************
   *
   * Task methods
   *
   ***************************/

  /**
   * Save a task, either editing or creating
   * @param ev
   */
  handleSaveTask = (ev) => {

    // cannot save without a task name
    const taskname = this.props.listRegistryStore.newTaskName || this.props.listRegistryStore.currentTask.taskname;
    if (taskname === ""){
      return false;
    }

    // cannot save with the wrong date format
    const datetime = this.props.listRegistryStore.newTaskDueDate || this.props.listRegistryStore.currentTask.duedate;
    const dateFormat = this.props.commonStore.datetimeFormat;
    if (datetime !== "" && moment(datetime, dateFormat, true).isValid() === false){
      return false;
    }

    this.props.listRegistryStore.saveTask()
  };

  /**
   * Handle the interface and deletion of a task
   * @param taskId
   */
  handleDeleteTask = (taskId) => {
    const listId = this.props.listRegistryStore.currentList.listId;
    this.props.listRegistryStore.deleteTask(listId, taskId);
  };

  /**
   * When the "complete" checkbox is checked, handle the server and interface updates
   * @param taskId
   */
  handleMarkTaskComplete = (taskId) => {
    this.props.listRegistryStore.loadCurrentTask(taskId);
    this.props.listRegistryStore.currentTask.completed = !this.props.listRegistryStore.currentTask.completed;
    this.props.listRegistryStore.saveTask();
  };

  /**
   * Handle changing the task name when editing in place
   * @param ev
   */
  handleChangeTaskName = (ev) => {
    this.props.listRegistryStore.currentTask.taskname = ev.target.value;
  };

  /**
   * Handle changing the task notes when editing in place
   * @param ev
   */
  handleChangeTaskNotes = (ev) => {
    this.props.listRegistryStore.currentTask.notes = ev.target.value;
  };

  /**
   * Handle changing the task due date when editing in place
   * @param ev
   */
  handleChangeTaskDuedate = (ev) => {
    this.props.listRegistryStore.currentTask.duedate = ev.target.value;
  };

  /**
   * Handle updating the registry with a new task name when adding a task
   * @param ev
   */
  handleChangeNewTaskName = (ev) => {
    this.props.listRegistryStore.newTaskName = ev.target.value;
  };

  /**
   * Handle updating the registry with a new task name when adding a task
   * @param ev
   */
  handleChangeNewTaskNotes = (ev) => {
    this.props.listRegistryStore.newTaskNotes = ev.target.value;
  };

  /**
   * Handle updating the registry with a new task name when adding a task
   * @param ev
   */
  handleChangeNewTaskDuedate = (ev) => {
    this.props.listRegistryStore.newTaskDueDate = ev.target.value;
  };

  /**********************************
   *
   * Search / completed / filter functions
   *
   **********************************/

  /**
   * Set the registry search value on input change
   * @param ev
   */
  handleChangeSearchBox = (ev) => {
    this.props.listRegistryStore.searchFilter = ev.target.value;
  };

  /**
   * When a filtered / searched item is found and selected, change the main interface
   * to accommodate that selection
   * @param ev
   */
  handleFilteredItemClick = (ev) => {
   ev.preventDefault();
   this.props.listRegistryStore.searchFilter = "";
   this.props.listRegistryStore.loadCurrentList(ev.target.id);
   this.props.history.push("/link/" + ev.target.id);
  };

  /**
   * Set the global task sort direction and reload the list.
   * @param direction
   */
  handleSortTasksClick = (direction) => {
    this.props.interfaceStore.taskSortOrder = direction;
    this.props.listRegistryStore.loadCurrentList(this.props.listRegistryStore.currentList.listId);
  };

  /**
   * Set the completed tasks view on select change
   * @param ev
   */
  handleChangeCompletedViewBox = (ev) => {
    this.props.interfaceStore.completedSelectValue = ev.target.value;
  };

  /********************************
   *
   * Rendering functions
   *
   ********************************/

  /**
   * Given a new task, assuming we have a selected current list, render the form
   * that allows you to add a new task
   *
   * If there is no current list, display nothing
   * @returns {*}
   */
  renderNewTaskForm(){
    if (this.props.listRegistryStore.currentList.listId){
      const { newTaskName, newTaskCompleted, newTaskNotes, newTaskDueDate } = this.props.listRegistryStore;
      return (
        <TaskForm
          taskname={newTaskName}
          completed={newTaskCompleted}
          taskNotes={newTaskNotes}
          taskDuedate={newTaskDueDate}
          handleSaveTask={this.handleSaveTask}
          handleChangeNewTaskNotes={this.handleChangeNewTaskNotes}
          handleChangeNewTaskDuedate={this.handleChangeNewTaskDuedate}
          handleChangeNewTaskName={this.handleChangeNewTaskName}
          dateformat={this.props.commonStore.datetimeFormat}
        />
      );
    }
    else {
      return null;
    }
  }

  /**
   * Given a current list, assuming we have a selected current list, display list's
   * tasks
   *
   * If there is no current list, display nothing
   * @returns {*}
   */
  renderTaskList(){
    if (this.props.listRegistryStore.currentList.listId){
      const taskSortOrder = this.props.interfaceStore.taskSortOrder;
      return(
        <TaskList
          isLoadingLists={this.props.listRegistryStore.isLoadingLists}
          currentList={this.props.listRegistryStore.currentList}
          handleSaveList={this.handleSaveList}
          handleSaveTask={this.handleSaveTask}
          handleChangeListName={this.handleChangeListName}
          handleChangeTaskName={this.handleChangeTaskName}
          handleChangeTaskNotes={this.handleChangeTaskNotes}
          handleChangeTaskDuedate={this.handleChangeTaskDuedate}
          handleMarkTaskComplete={this.handleMarkTaskComplete}
          handleDeleteTask={this.handleDeleteTask}
          handleDeleteList={this.handleDeleteList}
          handleSortTasksClick={this.handleSortTasksClick}
          taskSortOrder={taskSortOrder}
          completedSelectValue={this.props.interfaceStore.completedSelectValue}
          dateformat={this.props.commonStore.datetimeFormat}
        />
      );
    }
    else {
      return null;
    }
  }

  /**
   * Render our document!
   * @returns {*}
   */
  render(){
    const { isLoading, currentList, allLists, newListName, searchFilter, filteredTasks } = this.props.listRegistryStore;
    const { switchToList } = this.props.interfaceStore;
    const { completedSelectValue } = this.props.interfaceStore;

    if (this.props.userStore.currentUser && !isLoading){
      return (
        <div id='Home'>

          <div className="row">
            <div className="col">

              <ListNameSelect
                currentListId={currentList.listId}
                taskList={allLists}
                handleChangeListSelect={this.handleChangeListSelect}
              />

              <ListNameForm
                newListName={newListName}
                handleChangeNewListName={this.handleChangeNewListName}
                handleSaveList={this.handleSaveList}
                handleCangeSwitchToList={this.handleChangeSwitchToList}
                switchToList={switchToList}
                handleChangeSwitchToList={this.handleChangeSwitchToList}
              />

            </div>

            <div className="col">
              {this.renderNewTaskForm()}
            </div>

          </div>

          <div className="row mt-2">

            <div className="col">
              <SearchBox
                searchFilter={searchFilter}
                handleChangeSearchBox={this.handleChangeSearchBox}
              />
            </div>

            <div className="col">
              <CompletedViewSelect
                handleChangeCompletedViewBox={this.handleChangeCompletedViewBox}
                completedSelectValue={completedSelectValue}
              />
            </div>

          </div>

          <div className="row">
            <div className="col">
              <SearchedTaskList
                handleFilteredItemClick={this.handleFilteredItemClick}
                searchFilter={searchFilter}
                filteredTasks={filteredTasks}
              />
            </div>
          </div>

          <div className="row">
            <div className="col">
              {this.renderTaskList()}
            </div>
          </div>

        </div>
      );
    }
    else {
      return (<div id='Home'></div>);
    }
  }
}