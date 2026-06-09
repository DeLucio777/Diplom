import { Router } from 'express';
import TaskListsController from '../controllers/TaskListsController';

const router = Router();
const taskListsController = new TaskListsController();

// GET /api/task-lists
router.get('/', (req, res) => taskListsController.getAll(req, res));

// GET /api/task-lists/teacher/:teacherId
router.get('/teacher/:teacherId', (req, res) => taskListsController.getByTeacher(req, res));

// GET /api/task-lists/user/:userId
router.get('/user/:userId', (req, res) => taskListsController.getByUser(req, res));

// GET /api/task-lists/:taskListId/items
router.get('/:taskListId/items', (req, res) => taskListsController.getItems(req, res));

// POST /api/task-lists
router.post('/', (req, res) => taskListsController.create(req, res));

// DELETE /api/task-lists/:id
router.delete('/:id', (req, res) => taskListsController.delete(req, res));

export default router;