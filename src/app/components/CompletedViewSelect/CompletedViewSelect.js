import { Link } from 'react-router-dom';
import React from 'react';
import { inject, observer } from 'mobx-react';

/**
 * Select for choosing how to view completed tasks
 */
@observer
export default class CompletedViewSelect extends React.Component {

  handleChangeCompletedViewBox = this.props.handleChangeCompletedViewBox;

  render() {
    const { completedSelectValue } = this.props;
    //console.log(completedSelectValue);
    return (
      <div id="CompletedViewSelect">
        <form>
          <label htmlFor="completedViewSelect">Show or hide completed tasks:</label>
          <select
            id="completedViewSelect"
            name="completedViewSelect"
            value={completedSelectValue}
            className="form-control form-control-sm"
            onChange={this.handleChangeCompletedViewBox}
          >
            <option value="showCompleted">Show completed tasks</option>
            <option value="hideCompleted">Hide completed tasks</option>
          </select>
        </form>
      </div>
    );
  }
}
