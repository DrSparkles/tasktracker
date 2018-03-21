import TaskRow from './TaskRow';
import React from 'react';
import { inject, observer } from 'mobx-react';
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";

/**
 * Task List
 */
@inject('listRegistryStore', 'interfaceStore')
@observer
export default class TaskList extends React.Component {

  handleSaveList = this.props.handleSaveList;
  handleChangeListName = this.props.handleChangeListName;
  handleDeleteList = this.props.handleDeleteList;

  handleDeleteTask = this.props.handleDeleteTask;
  handleChangeTaskName = this.props.handleChangeTaskName;
  handleChangeTaskNotes = this.props.handleChangeTaskNotes;
  handleChangeTaskDuedate = this.props.handleChangeTaskDuedate;
  handleMarkTaskComplete = this.props.handleMarkTaskComplete;
  handleSaveTask = this.props.handleSaveTask;

  toggleEdit(listId){
    this.props.listRegistryStore.editList = listId;
  }

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

    const { tasks } = this.props.currentList;
    const taskRows  = tasks.map((task) => {
      if (this.props.interfaceStore.completedSelectValue === "showCompleted" || this.props.interfaceStore.completedSelectValue === "hideCompleted" && !task.completed){
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
          <table className="table table-sm table-striped mt-2">
            <thead>
              <tr>
                <th>Task</th>
                <th>Notes</th>
                <th>Due Date</th>
                <th>Complete?</th>
                <th>&nbsp;</th>
              </tr>
            </thead>
            <tbody>
              {taskRows}
            </tbody>
          </table>
        </div>
      );
    }
  }
}
