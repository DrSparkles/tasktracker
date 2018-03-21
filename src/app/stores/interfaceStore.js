import { observable, action, reaction } from 'mobx';

/**
 * App state for Blood Pressure entries
 */
class InterfaceStore {

  @observable completedSelectValue = window.localStorage.getItem("completedSelectValue") || "showCompleted";

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
  }

  /**
   * Clear our values
   */
  @action reset() {
    this.completedSelectValue = undefined;
  }
}

export default new InterfaceStore();