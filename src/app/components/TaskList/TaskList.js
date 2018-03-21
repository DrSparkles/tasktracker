import TaskRow from './TaskRow';
import React from 'react';
import { inject, observer } from 'mobx-react';
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";

/**
 * Task List
 */
@inject('listRegistryStore')
@observer
export default class TaskList extends React.Component {

  /**
   * Load functions from parent class
   */

  handleSaveList = this.props.handleSaveList;
  handleChangeListName = this.props.handleChangeListName;
  handleDeleteList = this.props.handleDeleteList;

  handleDeleteTask = this.props.handleDeleteTask;
  handleChangeTaskName = this.props.handleChangeTaskName;
  handleChangeTaskNotes = this.props.handleChangeTaskNotes;
  handleChangeTaskDuedate = this.props.handleChangeTaskDuedate;
  handleMarkTaskComplete = this.props.handleMarkTaskComplete;
  handleSaveTask = this.props.handleSaveTask;

  handleSortTasksClick = this.props.handleSortTasksClick;

  /**
   * Toggle the edit view for the list name
   * @param listId
   */
  toggleEdit(listId){
    this.props.listRegistryStore.editList = listId;
  }

  /**
   * Render methods
   */

  /**
   * Render the view to show the list name or the edit field for the list name
   * @returns {*}
   */
  renderListNameOrEditField(){
    if (this.props.listRegistryStore.editList){
      return (
        <div className="mt-2">
          <div className="row">
            <div className="col">
              <input
                name="taskname"
                id="taskname"
                type="text"
                value={this.props.currentList.listname}
                onChange={this.handleChangeListName}
                className="form-control form-control-sm"
              />
            </div>
            <div className="col">
              <span className="oi oi-check" title="Save" aria-hidden="true" onClick={this.handleSaveList} />
            </div>
          </div>
        </div>
      );
    }
    else {
      return (
        <div className="mt-2">
          <h3 className="float-left">{this.props.currentList.listname}</h3>
          <div className="float-left m-1">
            <span className="oi oi-pencil" title="Edit" aria-hidden="true" onClick={this.toggleEdit.bind(this, this.props.currentList.listId)} />
          </div>
          <div className="float-left m-1">
            <span className="oi oi-trash" title="Delete" aria-hidden="true" onClick={this.handleDeleteList} />
          </div>
        </div>
      );
    }
  }

  render() {
    const { completedSelectValue } = this.props;
    const { tasks } = this.props.currentList;
    const taskRows  = tasks.map((task) => {
      if (completedSelectValue === "showCompleted" || completedSelectValue === "hideCompleted" && !task.completed){
        return (
          <TaskRow
            handleSaveTask={this.handleSaveTask}
            handleChangeTaskName={this.handleChangeTaskName}
            handleChangeTaskNotes={this.handleChangeTaskNotes}
            handleChangeTaskDuedate={this.handleChangeTaskDuedate}
            handleMarkTaskComplete={this.handleMarkTaskComplete}
            handleDeleteTask={this.handleDeleteTask}
            key={task.taskId}
            task={task}
          />
        );
      }
      else {
        return null;
      }
    });

    // give a viable option for when the content is loading
    if (this.props.isLoadingLists) {
      return(
        <LoadingSpinner />
      );
    }

    // otherwise show the list
    else {

      return (
        <div id="TaskList">
          {this.renderListNameOrEditField()}
          <div className="table-responsive">
            <table className="table table-sm table-striped mt-2">
              <thead>
                <tr>
                  <th>
                    Task
                    <span className="oi oi-caret-top ml-2" title="Sort Asc" aria-hidden="true" onClick={this.handleSortTasksClick.bind(this, "taskname-asc")} />
                    <span className="oi oi-caret-bottom" title="Sort Desc" aria-hidden="true" onClick={this.handleSortTasksClick.bind(this, "taskname-desc")} />
                  </th>
                  <th>Notes</th>
                  <th>
                    Due Date
                    <span className="oi oi-caret-top ml-2" title="Sort Asc" aria-hidden="true" onClick={this.handleSortTasksClick.bind(this, "duedate-asc")} />
                    <span className="oi oi-caret-bottom" title="Sort Desc" aria-hidden="true" onClick={this.handleSortTasksClick.bind(this, "duedate-desc")} />
                  </th>
                  <th className="text-center">Complete?</th>
                  <th>&nbsp;</th>
                </tr>
              </thead>
              <tbody>
                {taskRows}
              </tbody>
            </table>
          </div>
        </div>
      );
    }
  }
}
