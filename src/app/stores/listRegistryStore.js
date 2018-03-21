import { observable, action, computed, toJS } from 'mobx';
import List from "./dataStores/List";
import interfaceStore from "./interfaceStore";
import agent from '../agent';
import moment from 'moment';

/**
 * App state for task lists and their various tasks
 */
class ListRegistryStore {

  /**
   * State of loading while fetching data from the db
   * @type {boolean}
   */
  @observable isLoadingLists = false;

  /**
   * State of the process during save
   * @type {boolean}
   */
  @observable isSavingList = false;

  /**
   * State while saving a task
   * @type {boolean}
   */
  @observable isSavingTask = false;

  /**
   * The registry of all the lists
   * @type {ObservableMap<any>}
   */
  @observable listRegistry = observable.map();

  /**
   * A container for the list id while editing; it should be undefined if not editing, else the listId
   * of the list being edited
   * @type {undefined | listId}
   */
  @observable editList = undefined;

  /**
   * A container for the task id while editing; it should be undefined if not editing, else the taskId
   * of the task being edited
   * @type {undefined | taskId}
   */
  @observable editTask = undefined;

  /**
   * The current list being viewed
   * @type {{listId: string, listname: string, tasks: Array}}
   */
  @observable currentList = {
    listId: "",
    listname: "",
    tasks: []
  };

  /**
   * The current task being processed, mostly for editing a task
   * @type {{taskId: string, taskname: string, notes: string, duedate: string, completed: boolean}}
   */
  @observable currentTask = {
    taskId: "",
    taskname: "",
    notes: "",
    duedate: "",
    completed: false
  };

  /**
   * A field to manage a new list name
   * @type {string}
   */
  @observable newListName = "";

  /**
   * The returned new listId from a save
   * @type {undefined}
   */
  @observable newListId = undefined;

  /**
   * A field to manage a new task name
   * @type {string}
   */
  @observable newTaskName = "";

  /**
   * A field to manage a new task note
   * @type {string}
   */
  @observable newTaskNotes = "";

  /**
   * A field to manage a new task due date
   * @type {string}
   */
  @observable newTaskDueDate = "";

  /**
   * A field to manage if a task is completed or not
   * @type {boolean}
   */
  @observable newTaskCompleted = false;

  /**
   * A field to manage searching tasks in lists.  It will either be a blank string because
   * nothing is being searched, or contain the string being searched
   * @type {string}
   */
  @observable searchFilter = "";

  /**
   * Fetch the values of the registry
   * @returns {*|(V[] & Iterator<V>)}
   */
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

  /**
   * Given a sort type, taskname ascending or descending and duedate ascending or descending, process the tasks
   * of the current list to be displayed properly.
   * @param list
   * @returns {*}
   */
  @action sortedCurrentTasks(list){

    let sorted = [];
    if (interfaceStore.taskSortOrder === "taskname-asc" || interfaceStore.taskSortOrder === "taskname-desc"){
      const sortOrder = (interfaceStore.taskSortOrder === "taskname-asc") ? "asc" : "desc";
      sorted = list.tasks.sort(function(a, b) {
        const nameA = a.taskname.toUpperCase(); // ignore upper and lowercase
        const nameB = b.taskname.toUpperCase(); // ignore upper and lowercase
        if (nameA < nameB) {
          return (sortOrder === "asc") ? -1 : 1;
        }
        if (nameA > nameB) {
          return (sortOrder === "asc") ? 1 : -1;
        }

        // names must be equal
        return 0;
      });
    }
    else if (interfaceStore.taskSortOrder === "duedate-asc" || interfaceStore.taskSortOrder === "duedate-desc"){
      const sortOrder = (interfaceStore.taskSortOrder === "duedate-asc") ? "asc" : "desc";
      sorted = list.tasks.sort(function(a, b) {
        const dateA = moment(a.duedate);
        const dateB = moment(b.duedate);
        if (dateA.isBefore(dateB)) {
          return (sortOrder === "asc") ? -1 : 1;
        }
        if (dateA.isAfter(dateB)) {
          return (sortOrder === "asc") ? 1 : -1;
        }

        // dates must be equal
        return 0;
      });

    }

    list.tasks = sorted;
    return list;
  }

  /**
   * Fetch the lists form the database and load the registry
   * @returns {Promise<any>}
   */
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

  /**
   * Given a listId, fetch the list being processed form the registry
   * @param listId
   * @returns {{listId: string, listname: string, tasks: Array}}
   */
  @action loadCurrentList(listId){
    if (!listId){
      this.currentList = {
        listId: "",
        listname: "",
        tasks: []
      };
    }
    else {
      this.currentList = this.sortedCurrentTasks(this.listRegistry.get(listId));
    }
    return this.currentList;
  }

  /**
   * Given a taskId, load the task currently being processed from the currentList
   * @param taskId
   * @returns {{taskId: string, taskname: string, notes: string, duedate: string, completed: boolean}}
   */
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

  /**
   * A universal save function that hinges on whether or not there is a new list name.  If that is not a
   * blank string, save a new list, else edit an existing list
   * @returns {*}
   */
  @action saveList(){
    if (this.newListName !== ""){
      return this.createNewList();
    }
    else {
      return this.editExitingList();
    }
  }

  /**
   * Edit an existing list, saving data to the database
   * @returns {Promise<any>}
   */
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

  /**
   * Create a new list, saving to teh database
   * @returns {Promise<any>}
   */
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

            if (interfaceStore.switchToList){
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

  /**
   * A universal save function that hinges on whether or not there is a new task name.  If that is not a
   * blank string, save a new task, else edit an existing task
   * @returns {*}
   */
  @action saveTask(){
    if (this.newTaskName !== ""){
      return this.createNewTask();
    }
    else {
      return this.editExistingTask();
    }
  }

  /**
   * Create a new task, saving to database
   * @returns {Promise<any>}
   */
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

  /**
   * Edit an existing task, saving to database
   * @returns {Promise<any>}
   */
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

  /**
   * Delete a list, removing the list from both the registry and the database
   * @param listId
   * @returns {Promise<any>}
   */
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

  /**
   * Delete a task, removing the task from both the currentList and the database
   * @param listId
   * @param taskId
   * @returns {Promise<any>}
   */
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

  /**
   * Reset the new list field
   */
  @action resetNewList(){
    this.newListName = "";
  }

  /**
   * Reset the new task fields
   */
  @action resetNewTask(){
    this.newTaskName = "";
    this.newTaskNotes = "";
    this.newTaskDueDate = "";
    this.newTaskCompleted = false;
  }

  /**
   * Reset the current list
   */
  @action resetList(){
    this.currentList = {
      listId: "",
      listname: "",
      tasks: []
    };
  }

  /**
   * Reset the current task
   */
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