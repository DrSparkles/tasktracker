import { observable, action, computed, toJS } from 'mobx';
import List from "./dataStores/List";
import Task from "./dataStores/Task";
import agent from '../agent';

/**
 * App state for task lists and their various tasks
 */
class ListRegistryStore {

  @observable isLoadingLists = false;
  @observable isSavingList = false;
  @observable isSavingTask = false;

  @observable listRegistry = observable.map();

  @observable editList = undefined;
  @observable editTask = undefined;

  @observable currentList = {
    listId: "",
    listname: "",
    tasks: []
  };

  @observable currentTask = {
    taskId: "",
    taskname: "",
    notes: "",
    duedate: "",
    completed: false
  };

  @observable newListName = "";
  @observable switchToList = true;
  @observable newListId = undefined;

  @observable newTaskName = "";
  @observable newTaskNotes = "";
  @observable newTaskDueDate = "";
  @observable newTaskCompleted = false;

  @observable doAddNewList = false;
  @observable doAddNewTask = false;

  @observable searchFilter = "";

  @computed get allLists(){
    return this.listRegistry.values();
  }

  /**
   * Get a filtered list given a search filter.  Since I cannot alter the core registry (because of
   * the observer pattern from MobX), create a new return array of list + matched tasks and return that.
   * @returns {Array}
   */
  @computed get filteredTasks(){
    const matchFilter = new RegExp(this.searchFilter, "i");
    const result = [];
    this.allLists.forEach((list) => {

      const filtered = list.tasks.filter((task) => {
        return !this.searchFilter || matchFilter.test(task.taskname);
      });

      if (filtered.length){
        const filteredList = {listId: list.listId, listname: list.listname, tasks: filtered};
        result.push(filteredList);
      }
    });

    return result;
  }

  @action loadLists(){
    this.isLoading = true;
    return agent.List
      .getAllForUser()
      .then(action((listItems) => {
        this.listRegistry.clear();
        const listItemData = listItems.result;
        listItemData.forEach((list) => {
          this.listRegistry.set(
            list._id,
            new List(
              list._id,
              list.listname,
              list.tasks
            ));
        });
      }))
      .catch(action((err) => {
        this.errors = err.response && err.response.body && err.response.body.message;
        throw err;
      }))
      .finally(action(() => {
        this.isLoading = false;
      }));
  }

  @action loadCurrentList(listId){
    if (!listId){
      this.currentList = {
        listId: "",
        listname: "",
        tasks: []
      };
    }
    else {
      this.currentList = this.listRegistry.get(listId) ;
    }
    return this.currentList;
  }

  @action loadCurrentTask(taskId){

    // clear task as needed if the task id comes in blank
    if (!taskId){
      this.currentTask = {
        taskId: "",
        taskname: "",
        notes: "",
        duedate: "",
        completed: false
      };
      return this.currentTask;
    }

    // map wasn't working here; needed a synchronous process
    for (let i = 0; i < this.currentList.tasks.length; i++){
      let task = this.currentList.tasks[i];
      if (task.taskId === taskId){
        this.currentTask = task;
        return this.currentTask;
      }
    }

    return this.currentTask;
  }

  @action saveList(){
    if (this.newListName !== ""){
      return this.createNewList();
    }
    else {
      return this.editExitingList();
    }
  }

  @action editExitingList(){

    this.isSavingList = true;

    const saveData = {
      listname: this.currentList.listname
    };

    return agent.List
      .editEntry(this.currentList.listId, saveData)
      .then(action(() => {
        this.editList = undefined;
      }))
      .catch(action((err) => {
        this.errors = err.response && err.response.body && err.response.body.message;
        throw err;
      }))
      .finally(action(() => {
        this.isSavingList = false;
      }));
  }

  @action createNewList(){

    this.isSavingList = true;

    const saveData = {
      listname: this.newListName,
    };

    return agent.List
      .createNew(saveData)
      .then(action((list) => {

        // reload the lists to grab the new one
        this.loadLists()
          .then(() => {

            // if the flag is checked to switch to the new list after the save,
            // note the listId to handle on the front end
            // otherwise, set the list id to the current list id
            let listId = this.currentList.listId;

            if (this.switchToList){
              listId = list.result._id;
              this.newListId = listId;
            }

            // whether switching to the new list or not, make sure the current list is loaded
            this.currentList = this.loadCurrentList(listId);
          });
      }))
      .catch(action((err) => {
        this.errors = err.response && err.response.body && err.response.body.message;
        throw err;
      }))
      .finally(action(() => {
        this.resetNewList();
        this.isSavingList = false;
      }));
  }

  @action saveTask(){
    if (this.newTaskName !== ""){
      return this.createNewTask();
    }
    else {
      return this.editExistingTask();
    }
  }

  @action createNewTask(){

    const saveData = {
      taskname: this.newTaskName,
      notes: this.newTaskNotes,
      duedate: this.newTaskDueDate,
      completed: this.newTaskCompleted
    };

    this.isSavingTask = true;
    return agent.Task
      .createNew(this.currentList.listId, saveData)
      .then(action(() => {
        this.loadLists()
          .then(() => {
            this.currentList = this.loadCurrentList(this.currentList.listId);
          });
      }))
      .catch(action((err) => {
        this.errors = err.response && err.response.body && err.response.body.message;
        throw err;
      }))
      .finally(action(() => {
        this.resetNewTask();
        this.isSavingTask = false;
      }));
  }

  @action editExistingTask(){
    const saveData = {
      taskname: this.currentTask.taskname,
      notes: this.currentTask.notes,
      duedate: this.currentTask.duedate,
      completed: this.currentTask.completed
    };

    this.isSavingTask = true;
    return agent.Task
      .editEntry(this.currentList.listId, this.currentTask.taskId, saveData)
      .then(action(() => {

      }))
      .catch(action((err) => {
        this.errors = err.response && err.response.body && err.response.body.message;
        throw err;
      }))
      .finally(action(() => {
        this.editTask = undefined;
        this.resetTask();
        this.isSavingTask = false;
      }));
  }

  @action deleteList(listId){
    return agent.List
      .deleteEntry(listId)
      .then(action(() => {
        this.listRegistry.delete(listId);
        this.resetList();
      }))
      .catch(action((err) => {
        this.errors = err.response && err.response.body && err.response.body.message;
        throw err;
      }))
      .finally(action(() => {

      }));
  }

  @action deleteTask(listId, taskId){
    return agent.Task
      .deleteEntry(listId, taskId)
      .then(action(() => {

        // loop through our lists...
        this.allLists.map((list) => {

          // only do more looping if the ids match...
          if (listId === this.currentList.listId){

            // then cull the task from our list and reset the current list with the change
            list.tasks.forEach((task, index) => {
              if (task.taskId === taskId){
                list.tasks.splice(index, 1);
                this.currentList = list;
              }
            });
          }
        });
      }))
      .catch(action((err) => {
        this.errors = err.response && err.response.body && err.response.body.message;
        throw err;
      }))
      .finally(action(() => {

      }));
  }

  @action resetNewList(){
    this.newListName = "";
  }

  @action resetNewTask(){
    this.newTaskName = "";
    this.newTaskNotes = "";
    this.newTaskDueDate = "";
    this.newTaskCompleted = false;
  }

  @action resetList(){
    this.currentList = {
      listId: "",
      listname: "",
      tasks: []
    };
  }

  @action resetTask(){
    this.currentTask = {
      taskId: "",
      taskname: "",
      notes: "",
      duedate: "",
      completed: false
    };
  }

}

export default new ListRegistryStore();