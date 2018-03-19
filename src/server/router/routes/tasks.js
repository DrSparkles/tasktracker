const express = require('express');
const router = express.Router();
import tasksModule from '../../modules/tasks';
import authMiddleware from '../../lib/tokenAuth.middleware';
import { errorHandler } from "../../lib/db";

/**
 * APPLY AUTH MIDDLEWARE; ALL FOLLOWING ROUTES ARE PROTECTED
 */
router.use(authMiddleware);

router.route('/:listId/tasks')
  .post((req, res) => {
    const listId = req.params.listId;
    const { body } = req;

    tasksModule.createNew(listId, body, (err, docs) => {
      if (err) return errorHandler(err, res);
      return res.json(docs);
    });
  })
  .get((req, res) => {
    const listId = req.params.listId;
    tasksModule.getListTasks(listId, (err, docs) => {
      if (err) return errorHandler(err, res);
      return res.json(docs);
    })
  });

router.route('/:listId/tasks/:taskId')
  .get((req, res) => {
    const { taskId } = req.params;
    tasksModule.getTask(taskId, (err, docs) => {
      if (err) return errorHandler(err, res);
      return res.json(docs);
    });
  })
  .put((req, res) => {
    const { taskId } = req.params;
    const body = req.body;
    tasksModule.updateTask(taskId, body, (err, docs) => {
      if (err) return errorHandler(err, res);
      return res.json(docs);
    });
  })
  .delete((req, res) => {
    const { listId, taskId } = req.params;
    tasksModule.deleteTask(listId, taskId, (err, docs) => {
      if (err) return errorHandler(err, res);
      return res.json(docs);
    });
  });

module.exports = router;