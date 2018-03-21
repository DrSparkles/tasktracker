import React from 'react';
import { observer } from 'mobx-react';

/**
 * Select box to choose the list to view
 */
@observer
export default class ListNameSelect extends React.Component {

  handleChangeListSelect = this.props.handleChangeListSelect;

  render() {
    const { taskList } = this.props;
    const listOptions  = taskList.map((list) => {
      return (
        <option
          key={list.listId}
          id={list.listId}
          value={list.listId}
        >
          {list.listname}
        </option>
      );
    });
    return (
      <div id="ListNameSelect">
        <form>
          <label htmlFor="listname">Select a list to view:</label>
          <select
            id="currentlist"
            name="currentlist"
            value={this.props.currentListId}
            className="form-control form-control-sm"
            onChange={this.handleChangeListSelect}
          >
            <option value="">List to view...</option>
            {listOptions}
          </select>
        </form>
      </div>
    );
  }
}
