import React from 'react';
import { inject, observer } from 'mobx-react';

/**
 * Form to add a task
 */
@observer
export default class TaskForm extends React.Component {

  handleChangeNewTaskName = this.props.handleChangeNewTaskName;
  handleSaveTask = this.props.handleSaveTask;
  handleChangeNewTaskNotes = this.props.handleChangeNewTaskNotes;
  handleChangeNewTaskDuedate = this.props.handleChangeNewTaskDuedate;


  render() {
    return (
      <div id="TaskForm">
        <form>
          <div className="row">
            <div className="col">
              <label htmlFor="taskname">Add new task:</label>
            </div>
          </div>

          <div className="row">
            <div className="col">
              <input
                name="taskname"
                id="taskname"
                type="text"
                placeholder="Example: Sort Emails"
                value={this.props.taskname}
                onChange={this.handleChangeNewTaskName}
                className="form-control form-control-sm"
              />
            </div>
          </div>

          <div className="row mt-1">
            <div className="col">
              <textarea
                name="notes"
                id="notes"
                placeholder="Notes"
                value={this.props.taskNotes}
                onChange={this.handleChangeNewTaskNotes}
                className="form-control form-control-sm"
              />
            </div>
          </div>

          <div className="row mt-1">
            <div className="col">
              <input
                name="duedate"
                id="duedate"
                type="text"
                placeholder="2020-01-01"
                value={this.props.taskDuedate}
                onChange={this.handleChangeNewTaskDuedate}
                className="form-control form-control-sm"
              />
            </div>
          </div>

          <div className="row mt-1">
            <div className="col">
              <button
                name="saveTask"
                id="saveTask"
                type="button"
                value="Save"
                onClick={this.handleSaveTask}
                className="btn btn-sm align-middle"
              >
                Save
              </button>
            </div>
          </div>
        </form>
      </div>
    );
  }
}
