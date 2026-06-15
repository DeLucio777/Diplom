import { Router } from 'express';
import TaskListItemsController from '../controllers/TaskListItemsController';

const router = Router();
const taskListItemsController = new TaskListItemsController();

router.get('/', (req, res) => taskListItemsController.getAll(req, res));
router.get('/:id', (req, res) => taskListItemsController.getById(req, res));
router.put('/:id/complete', (req, res) => taskListItemsController.completeItem(req, res));
router.post('/complete-for-user', (req, res) => taskListItemsController.completeForUser(req, res));

export default router;
