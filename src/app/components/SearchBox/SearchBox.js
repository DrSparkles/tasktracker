import React from 'react';
import { inject, observer } from 'mobx-react';

/**
 * Display the search box
 */
@observer
export default class SearchBox extends React.Component {

  handleChangeSearchBox = this.props.handleChangeSearchBox;

  render() {

    return (
      <div id="SearchBox">
        <form>
          <label htmlFor="listname">Search:</label>
          <input
            type="text"
            id="searchtasks"
            name="searchtasks"
            value={this.props.searchFilter}
            onChange={this.handleChangeSearchBox}
            placeholder="Search Tasks..."
            className="form-control form-control-sm"
          />
        </form>
      </div>
    );
  }
}
