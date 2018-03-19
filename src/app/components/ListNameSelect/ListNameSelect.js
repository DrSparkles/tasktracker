import { Link } from 'react-router-dom';
import ListErrors from '../ListErrors';
import React from 'react';
import { inject, observer } from 'mobx-react';

/**
 * Registration form for users
 */
@observer
export default class ListNameSelect extends React.Component {

  /**
   * Clear the user fields when the form is done
   */
  componentWillUnmount() {

  }

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
