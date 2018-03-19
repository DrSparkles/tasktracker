import { Link } from 'react-router-dom';
import ListErrors from '../ListErrors';
import React from 'react';
import { inject, observer } from 'mobx-react';

/**
 * List name form for saving and editing lists
 */
@observer
export default class ListNameForm extends React.Component {

  handleSaveList = this.props.handleSaveList;
  handleChangeNewListName = this.props.handleChangeNewListName;
  handleChangeSwitchToList = this.props.handleChangeSwitchToList;

  render() {

    const { newListName, switchToList } = this.props;

    return (
      <div id="ListNameForm">
        <form>

          <div className="">
            <label htmlFor="listname">Add new list:</label>
          </div>

          <div className="">
            <input
              name="listname"
              id="listname"
              type="text"
              placeholder="Example: Work Tasks"
              value={newListName}
              onChange={this.handleChangeNewListName}
              className="form-control form-control-sm"
            />
          </div>

          <div className="col">
            <button
              name="saveList"
              id="saveList"
              value="Save"
              onClick={this.handleSaveList}
              className="btn btn-sm float-left"
            >
              Save
            </button>
          </div>

          <div className="form-check form-check-inline">
            <input
              name="switchToList"
              id="switchToList"
              type="checkbox"
              value={switchToList}
              checked={switchToList}
              onChange={this.handleChangeSwitchToList}
              className="form-check-input"
            />
            <label htmlFor="listname" className="form-check-label">Switch to list?</label>
          </div>

        </form>
      </div>
    );
  }
}
