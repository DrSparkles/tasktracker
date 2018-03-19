import React from 'react';
import { observer } from 'mobx-react';

/**
 * Display the values from a filtering search
 */
@observer
export default class SearchedTaskList extends React.Component {

  handleFilteredItemClick = this.props.handleFilteredItemClick;

  renderSearchedListsTasks(linkId, tasks){
    return tasks.map((task) => {
      const url = "/list/" + linkId;
      return (
        <div key={task.taskId}>
          <a href={url} onClick={this.handleFilteredItemClick} id={linkId}>{task.taskname}</a>
        </div>
      );
    });
  }

  render() {

    // get the list name and tasks that match the search value
    const filteredRows = this.props.filteredTasks.map((list) => {
      const url = "/list/" + list.listId;
      return (
        <div key={list.listId}>
          <div>
            <a href={url} onClick={this.handleFilteredItemClick} id={list.listId}>{list.listname}</a>
          </div>
          {this.renderSearchedListsTasks(list.listId, list.tasks)}
        </div>
      );
    });

    // only print search results if there's a searchFilter value
    if (this.props.searchFilter) {
      return (
        <div id="SearchedTaskList">
          {filteredRows}
        </div>
      );
    }

    else {
      return null;
    }
  }
}
