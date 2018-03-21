import { observable } from 'mobx';

export default class Task {
  @observable taskId = "";
  @observable taskname = "";
  @observable notes = "";
  @observable duedate = "";
  @observable completed = false;

  constructor(taskId, taskname, notes, duedate, completed = false) {
    this.taskId = taskId;
    this.taskname = taskname;
    this.notes = notes;
    this.duedate = duedate;
    this.completed = completed;
  }
}