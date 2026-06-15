import { Router } from 'express';
import TaskController from '../controllers/taskController';

const router = Router();
const taskController = new TaskController();

// GET /api/task-constructions
router.get('/task-constructions', (req, res) => taskController.getAllConstructions(req, res));

// GET /api/find-odd-items
router.get('/find-odd-items', (req, res) => taskController.getAllFindOddItems(req, res));

// GET /api/match-pairs
router.get('/match-pairs', (req, res) => taskController.getAllMatchPairs(req, res));

// GET /api/sequence-items
router.get('/sequence-items', (req, res) => taskController.getAllSequenceItems(req, res));

// GET /api/sort-items
router.get('/sort-items', (req, res) => taskController.getAllSortItems(req, res));

export default router;
