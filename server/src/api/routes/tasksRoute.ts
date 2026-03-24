import { Router } from 'express';
import TaskController from '../controllers/taskController';

const router = Router();
const taskController = new TaskController();

// GET /api/tasks
router.get('/', (req, res) => taskController.getAll(req, res));

// GET /api/tasks/:id 
router.get('/:id', (req, res) => taskController.getById(req, res));

// GET /api/tasks/:taskId/constructions 
router.get('/:taskId/constructions', (req, res) => taskController.getConstructions(req, res));

// GET /api/tasks/:taskId/find-odd-items 
router.get('/:taskId/find-odd-items', (req, res) => taskController.getFindOddItems(req, res));

// GET /api/tasks/:taskId/match-pairs 
router.get('/:taskId/match-pairs', (req, res) => taskController.getMatchPairs(req, res));

// GET /api/tasks/:taskId/sequence-items 
router.get('/:taskId/sequence-items', (req, res) => taskController.getSequenceItems(req, res));

// GET /api/tasks/:taskId/sort-items 
router.get('/:taskId/sort-items', (req, res) => taskController.getSortItems(req, res));

// POST /api/tasks 
router.post('/', (req, res) => taskController.create(req, res));

// POST /api/tasks/full 
router.post('/full', (req, res) => taskController.createFull(req, res));

// DELETE /api/tasks/:id
router.delete('/:id', (req, res) => taskController.delete(req, res));

export default router;
