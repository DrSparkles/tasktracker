import { observable, action, reaction } from 'mobx';

/**
 * Interface state
 */
class InterfaceStore {

  /**
   * This will either be "showCompleted" or "hideCompleted", and will manage both the select list for
   * managing showing or hiding completed task items and displaying them as well.
   * Default to showCompleted
   * @type {string | null | string}
   */
  @observable completedSelectValue = window.localStorage.getItem("completedSelectValue") || "showCompleted";

  /**
   * Manage the task sort order - values are taskname-asc, taskname-desc, duedate-asc, or duedate-desc
   * It will default to duedate-desc
   * @type {string | null | string}
   */
  @observable taskSortOrder = window.localStorage.getItem("taskSortOrder") || "duedate-desc";

  /**
   * Manage whether or not to switch to the new list when adding a new list item
   * @type {string | null | boolean}
   */
  @observable switchToList = window.localStorage.getItem("switchToList") || true;

  constructor() {
    reaction(
      () => this.completedSelectValue,
      completedSelectValue => {

        // if there is already a value that's been set in local storage, use that
        if (completedSelectValue) {
          window.localStorage.setItem('completedSelectValue', completedSelectValue);
        }
        // otherwise set to default value
        else {
          window.localStorage.setItem('completedSelectValue', "showCompleted");
        }
      }
    );

    reaction(
      () => this.taskSortOrder,
      taskSortOrder => {

        // if there is already a value that's been set in local storage, use that
        if (taskSortOrder) {
          window.localStorage.setItem('taskSortOrder', taskSortOrder);
        }
        // otherwise set to default value
        else {
          window.localStorage.setItem('taskSortOrder', "duedate-desc");
        }
      }
    );

    reaction(
      () => this.switchToList,
      switchToList => {
        window.localStorage.setItem('switchToList', switchToList);
      }
    );
  }

  /**
   * Clear our values
   */
  @action reset() {
    this.completedSelectValue = undefined;
  }
}

export default new InterfaceStore();