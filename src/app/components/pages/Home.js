/**
 * Home page
 */

import React from "react";

import { inject, observer } from 'mobx-react';
import ListNameForm from "../../components/ListNameForm";
import ListNameSelect from "../../components/ListNameSelect";
import TaskForm from "../../components/TaskForm";
import TaskList from "../../components/TaskList";
import SearchBox from "../SearchBox/SearchBox";
import SearchedTaskList from "../SearchedTaskList/SearchedTaskList";

@inject('userStore', 'listRegistryStore')
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
    this.props.listRegistryStore.switchToList = !this.props.listRegistryStore.switchToList;
  };

  /**
   * Handle saving a list - either editing or creating
   * @param ev
   */
  handleSaveList = (ev) => {
    ev.preventDefault();
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
   * Search / filter functions
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
   this.props.listRegistryStore.loadCurrentList(ev.target.id);
   this.props.history.push("/link/" + ev.target.id);
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
        <div className="col">
          <TaskForm
            taskname={newTaskName}
            completed={newTaskCompleted}
            taskNotes={newTaskNotes}
            taskDuedate={newTaskDueDate}
            handleSaveTask={this.handleSaveTask}
            handleChangeNewTaskNotes={this.handleChangeNewTaskNotes}
            handleChangeNewTaskDuedate={this.handleChangeNewTaskDuedate}
            handleChangeNewTaskName={this.handleChangeNewTaskName}
          />
        </div>
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
      return(
        <div className="row">
          <div className="col">
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
            />
          </div>
        </div>
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
    const { isLoading, currentList, allLists, newListName, switchToList, searchFilter, filteredTasks } = this.props.listRegistryStore;
    if (this.props.userStore.currentUser && !isLoading){
      return (
        <div id='Home'>
          <h1>Home</h1>
            <div className="row">

              {/* list management column */}
              <div className="col-6">
                <div className="row">
                  <ListNameSelect
                    currentListId={currentList.listId}
                    taskList={allLists}
                    handleChangeListSelect={this.handleChangeListSelect}
                  />
                </div>
                <div className="row">
                  <ListNameForm
                    newListName={newListName}
                    handleChangeNewListName={this.handleChangeNewListName}
                    handleSaveList={this.handleSaveList}
                    handleCangeSwitchToList={this.handleChangeSwitchToList}
                    switchToList={switchToList}
                    handleChangeSwitchToList={this.handleChangeSwitchToList}
                  />
                </div>
              </div>

              {/* task management column */}
              <div className="col-6">
                {this.renderNewTaskForm()}
              </div>

            </div>{/* end row */}


          <div className="row">
            <div className="col-12">
              <SearchBox
                searchFilter={searchFilter}
                handleChangeSearchBox={this.handleChangeSearchBox}
              />

              <SearchedTaskList
                handleFilteredItemClick={this.handleFilteredItemClick}
                searchFilter={searchFilter}
                filteredTasks={filteredTasks}
              />
            </div>
          </div>

          {this.renderTaskList()}

        </div>
      );
    }
    else {
      return (<div id='Home'></div>);
    }
  }
}