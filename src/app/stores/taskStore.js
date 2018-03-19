import { observable, action, computed } from 'mobx';
import agent from '../agent';

/**
 * App state for Blood Pressure entries
 */
class TaskStore {

  @observable taskId = undefined;

  @observable taskname = '';

  @observable complete = undefined;

  /**
   * Setter for the taskId
   * @param {string | number} taskId
   */
  @action setTaskId(taskId) {
    if (this.taskId !== taskId) {
      this.reset();
      this.taskId = taskId;
    }
  }

  /**
   * Clear our values
   */
  @action reset() {
    this.taskId = undefined;
    this.taskname = '';
    this.complete = undefined;
  }
}

export default new TaskStore();