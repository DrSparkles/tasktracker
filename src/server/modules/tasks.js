import { db, returnSimpleResult, returnSimpleError, getId } from '../lib/db';

/**
 * Handle user auth
 */
class Tasklist {

  constructor(){
    this.task_collection = db.get('tasklist');
  }

  /**
   * Create a task for a given user
   * {
   *    taskname: STRING,
   *    userId: STRING
   * }
   * @param listId
   * @param taskValues
   * @param cb
   */
  createNew(listId, taskValues, cb){

    // validation...
    const validationErrors = [];
    if (taskValues.taskname === undefined || taskValues.taskname === ""){
      validationErrors.push("Must have a task name to create a new entry.");
    }

    if (taskValues.duedate === undefined){
      validationErrors.push("Must have a task duedate field in the task, even if blank, to create a new entry.");
    }

    if (taskValues.notes === undefined){
      validationErrors.push("Must have a task notes field in the task, even if blank, to create a new entry.");
    }

    if (taskValues.completed === undefined){
      validationErrors.push("Must have a task completed field in the task, even if blank, to create a new entry.");
    }

    // error on out validation problems
    if (validationErrors.length){
      return returnSimpleError(validationErrors, 400, cb);
    }

    taskValues._id = getId();

    const listObjectId = getId(listId);
    const listQuery = {
      _id: listObjectId
    };

    const taskInsertQuery = {
      "$push": {
        "tasks": taskValues
      }
    };

    this.task_collection.update(listQuery, taskInsertQuery, (err, doc) => {
      if (err) return returnSimpleError(err, 400, cb);
      return returnSimpleResult(err, doc, cb);
    });
  }

  /**
   * Get the tasks for a specific list
   * @param listId
   * @param cb
   * @returns {*}
   */
  getListTasks(listId, cb){

    // if no userId error out
    if (listId === undefined || listId === ""){
      return returnSimpleError("Must have a list id to fetch their entries.", 400, cb);
    }

    const listObjectId = getId(listId);
    const listQuery = {
      _id: listObjectId
    };

    // else return our data
    this.task_collection.find(listQuery, ["tasks"], (err, doc) => {
      if (err) return returnSimpleError(err, 400, cb);
      return returnSimpleResult(err, doc, cb);
    });
  }

  /**
   * Get a specific task
   * @param taskId
   * @param cb
   * @returns {*}
   */
  getTask(taskId, cb){
    // if no userId error out
    if (taskId === undefined || taskId === ""){
      return returnSimpleError("Must have a task id to fetch the entries.", 400, cb);
    }

    // else return our data
    const taskObjectId = getId(taskId);
    this.task_collection.find({"tasks._id": taskObjectId}, {"tasks._id.$": true}, (err, doc) => {
      if (err) return returnSimpleError(err, 400, cb);
      return returnSimpleResult(err, doc, cb);
    });
  }

  /**
   * Update a specific task
   * @param taskId
   * @param taskData
   * @param cb
   * @returns {*}
   */
  updateTask(taskId, taskData, cb){

    if (taskId === undefined || taskId === ""){
      return returnSimpleError("Must have an id to update an entry.", 400, cb);
    }

    // validation...
    const validationErrors = [];
    if (taskData.taskname === undefined || taskData.taskname === ""){
      validationErrors.push("Must have a task name to create a new entry.");
    }

    if (taskData.duedate === undefined){
      validationErrors.push("Must have a task duedate field in the task, even if blank, to create a new entry.");
    }

    if (taskData.notes === undefined){
      validationErrors.push("Must have a task notes field in the task, even if blank, to create a new entry.");
    }

    if (taskData.completed === undefined){
      validationErrors.push("Must have a task completed field in the task, even if blank, to create a new entry.");
    }

    // error on out validation problems
    if (validationErrors.length){
      return returnSimpleError(validationErrors, 400, cb);
    }

    const taskObjectId = getId(taskId);
    taskData._id = taskObjectId;

    const query = {"tasks._id": taskObjectId};
    const update = {"$set": {"tasks.$": taskData}};

    this.task_collection.findOneAndUpdate(query, update, (err, doc) => {
      if (err) return returnSimpleError(err, 400, cb);
      return returnSimpleResult(err, doc, cb);
    });
  }

  /**
   * Delete a specific task
   * @param listId
   * @param taskId
   * @param cb
   * @returns {*}
   */
  deleteTask(listId, taskId, cb){
    // if no taskId error out
    if (taskId === undefined || taskId === ""){
      return returnSimpleError("Must have a task id to delete the entries.", 400, cb);
    }

    // if no listId error out
    if (listId === undefined || listId === ""){
      return returnSimpleError("Must have a list id to delete the entries.", 400, cb);
    }

    // else return our data
    const listObjectId = getId(listId);
    const taskObjectId = getId(taskId);
    const query = {"_id": listObjectId};

    const deleteQuery = {
      $pull: {"tasks": {_id: taskObjectId}}
    };

    this.task_collection.update(query, deleteQuery, (err, doc) => {
      if (err) return returnSimpleError(err, 400, cb);
      return returnSimpleResult(err, doc, cb);
    });
  }
}

export default new Tasklist();