import React from 'react';
import { observer } from 'mobx-react';

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
          <div className="row">
            <div className="col">
              <label htmlFor="listname">Add a new list:</label>
            </div>
          </div>

          <div className="row">
            <div className="col">
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
          </div>

          <div className="row mt-1">
            <div className="col">
              <input
                name="switchToList"
                id="switchToList"
                type="checkbox"
                value={switchToList}
                checked={switchToList}
                onChange={this.handleChangeSwitchToList}
                className=""
              />

              <label htmlFor="switchToList" className="form-check-label ml-1">Switch to list?</label>
            </div>
          </div>

          <div className="row mt-1">
            <div className="col">
              <button
                name="saveList"
                id="saveList"
                value="Save"
                onClick={this.handleSaveList}
                className="btn btn-sm"
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
