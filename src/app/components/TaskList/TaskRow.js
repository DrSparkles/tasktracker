import React from 'react';
import { inject, observer } from 'mobx-react';
import moment from "moment";
import { isTwoDaysComingOrLate, isAWeekAhead } from '../../lib/dateManagement';

/**
 * The individual row for the task table
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

  /**
   * Toggle which task is being edited to show either the edit form or just display the content
   * @param taskId
   */
  toggleEdit(taskId){
    this.props.listRegistryStore.editTask = taskId;
    this.props.listRegistryStore.loadCurrentTask(taskId);
  }

  /**
   * Render the task name if a registry task is set, else the form
   * @param task
   * @returns {*}
   */
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

  /**
   * Render the task notes if a registry task is set, else the form
   * @param task
   * @returns {*}
   */
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

  /**
   * Render the task due date if a registry task is set, else the form
   * @param task
   * @returns {*}
   */
  renderTaskDuedateOrInput(task){

    if (this.props.listRegistryStore.editTask !== undefined && this.props.listRegistryStore.editTask === task.taskId){
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

      // set the correct class for the row given the date
      let dateClass = "float-left";
      if (task.duedate){

        const momentForDueDate = moment(task.duedate);
        if (isTwoDaysComingOrLate(momentForDueDate) && task.completed === false){
          dateClass = "float-left text-danger font-weight-bold";
        }
        else if (isAWeekAhead(momentForDueDate) && task.completed === false){
          dateClass = "float-left due-date-upcoming font-weight-bold";
        }
      }

      return (
        <div className={dateClass}>{task.duedate}</div>
      );
    }
  }

  /**
   * Render the task edit and complete buttons, else the save button
   * @param task
   * @returns {*}
   */
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
        <td className="text-center">
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
