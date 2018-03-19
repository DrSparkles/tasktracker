import { Link } from 'react-router-dom';
import ListErrors from '../ListErrors';
import React from 'react';
import { inject, observer } from 'mobx-react';

/**
 * Registration form for users
 */
@inject('listRegistryStore')
@observer
export default class TaskList extends React.Component {


  handleChangeTaskName = this.props.handleChangeTaskName;
  handleSaveTask = this.props.handleSaveTask;
  handleDeleteTask = this.props.handleDeleteTask;
  handleMarkTaskComplete = this.props.handleMarkTaskComplete;
  handleChangeTaskNotes = this.props.handleChangeTaskNotes;
  handleChangeTaskDuedate = this.props.handleChangeTaskDuedate;

  toggleEdit(taskId){
    this.props.listRegistryStore.editTask = taskId;
    this.props.listRegistryStore.loadCurrentTask(taskId);
  }

  renderTaskNameOrInput(task){

    if (this.props.listRegistryStore.editTask !== undefined && this.props.listRegistryStore.editTask === task.taskId){
      return (
        <div>
          <div className="float-left m-1">
            <input
              name="taskname"
              id="taskname"
              type="text"
              value={this.props.task.taskname}
              onChange={this.handleChangeTaskName}
              className="form-control form-control-sm"
            />
          </div>
        </div>
      );
    }
    else {
      return (
        <div className="float-left">{task.taskname}</div>
      );
    }
  }

  renderTaskNotesOrInput(task){

    if (this.props.listRegistryStore.editTask !== undefined && this.props.listRegistryStore.editTask === task.taskId){
      return (
        <div>
          <div className="float-left m-1">
            <input
              name="taskname"
              id="taskname"
              type="text"
              value={this.props.task.notes}
              onChange={this.handleChangeTaskNotes}
              className="form-control form-control-sm"
            />
          </div>
        </div>
      );
    }
    else {
      return (
        <div className="float-left">{task.notes}</div>
      );
    }
  }

  renderTaskDuedateOrInput(task){
console.log(task);
    if (this.props.listRegistryStore.editTask !== undefined){
      return (
        <div>
          <div className="float-left m-1">
            <input
              name="taskname"
              id="taskname"
              type="text"
              value={this.props.task.duedate}
              onChange={this.handleChangeTaskDuedate}
              className="form-control form-control-sm"
            />
          </div>
        </div>
      );
    }
    else {
      return (
        <div className="float-left">{task.duedate}</div>
      );
    }
  }

  renderEditDeleteControls(task){
    if (this.props.listRegistryStore.editTask === undefined && this.props.listRegistryStore.editTask !== task.taskId){
      return(
        <div>
          <div className="float-left m-1">
            <span className="oi oi-pencil" title="Edit" aria-hidden="true" onClick={this.toggleEdit.bind(this, task.taskId)} />
          </div>
          <div className="float-left m-1">
            <span className="oi oi-trash" title="Delete" aria-hidden="true" onClick={this.handleDeleteTask.bind(this, task.taskId)} />
          </div>
        </div>
      );
    }
    else if (this.props.listRegistryStore.editTask === task.taskId) {
      return(
        <div className="float-left m-1">
          <span className="oi oi-check float-left m-1" title="Save" aria-hidden="true" onClick={this.handleSaveTask} />
        </div>
      );
    }
    else {
      return null;
    }
  }

  render() {

    const { taskId, completed } = this.props.task;

    return (
      <tr>
        <td>
          {this.renderTaskNameOrInput(this.props.task)}
        </td>
        <td>
          {this.renderTaskNotesOrInput(this.props.task)}
        </td>
        <td>
          {this.renderTaskDuedateOrInput(this.props.task)}
        </td>
        <td>
          <input
            name="markComplete"
            id="markComplete"
            type="checkbox"
            value={completed}
            checked={completed}
            onChange={this.handleMarkTaskComplete.bind(null, taskId)}
          />
        </td>
        <td>
          {this.renderEditDeleteControls(this.props.task)}
        </td>
      </tr>
    );
  }
}
