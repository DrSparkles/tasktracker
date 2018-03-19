import { observable, action, computed } from 'mobx';
import Task from "./Task";

export default class List {
  @observable listId = "";
  @observable listname = "";
  @observable tasks = [];

  constructor(listId, listname, tasks = []) {
    this.listId = listId;
    this.listname = listname;
    this.tasks = tasks.map((task) => {
      if (task.notes === undefined){
        task.notes = "";
      }

      if (task.duedate === undefined){
        task.duedate = "";
      }
      return new Task(task._id, task.taskname, task.notes, task.duedate, task.completed);
    });

  }
}

