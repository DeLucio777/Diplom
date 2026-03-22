import { Router } from 'express';
import TaskController from '../controllers/taskController';

const router = Router();
const taskController = new TaskController();

// GET /api/tasks - Get all tasks
router.get('/', (req, res) => taskController.getAll(req, res));

// GET /api/tasks/:id - Get task by ID
router.get('/:id', (req, res) => taskController.getById(req, res));

// GET /api/tasks/:taskId/constructions - Get task constructions
router.get('/:taskId/constructions', (req, res) => taskController.getConstructions(req, res));

// GET /api/tasks/:taskId/find-odd-items - Get find odd items
router.get('/:taskId/find-odd-items', (req, res) => taskController.getFindOddItems(req, res));

// GET /api/tasks/:taskId/match-pairs - Get match pairs
router.get('/:taskId/match-pairs', (req, res) => taskController.getMatchPairs(req, res));

// GET /api/tasks/:taskId/sequence-items - Get sequence items
router.get('/:taskId/sequence-items', (req, res) => taskController.getSequenceItems(req, res));

// GET /api/tasks/:taskId/sort-items - Get sort items
router.get('/:taskId/sort-items', (req, res) => taskController.getSortItems(req, res));

// POST /api/tasks - Create simple task
router.post('/', (req, res) => taskController.create(req, res));

// POST /api/tasks/full - Create full task with all related data
router.post('/full', (req, res) => taskController.createFull(req, res));

// DELETE /api/tasks/:id - Delete task and all related items
router.delete('/:id', (req, res) => taskController.delete(req, res));

export default router;
