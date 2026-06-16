import { Router } from 'express';
import TaskController from '../controllers/taskController';

const router = Router();
const taskController = new TaskController();

// GET/POST /api/task-constructions
router.get('/task-constructions', (req, res) => taskController.getAllConstructions(req, res));
router.post('/task-constructions', (req, res) => taskController.createConstruction(req, res));

// GET/POST /api/find-odd-items
router.get('/find-odd-items', (req, res) => taskController.getAllFindOddItems(req, res));
router.post('/find-odd-items', (req, res) => taskController.createFindOddItem(req, res));

// GET/POST /api/match-pairs
router.get('/match-pairs', (req, res) => taskController.getAllMatchPairs(req, res));
router.post('/match-pairs', (req, res) => taskController.createMatchPair(req, res));

// GET/POST /api/sequence-items
router.get('/sequence-items', (req, res) => taskController.getAllSequenceItems(req, res));
router.post('/sequence-items', (req, res) => taskController.createSequenceItem(req, res));

// GET/POST /api/sort-items
router.get('/sort-items', (req, res) => taskController.getAllSortItems(req, res));
router.post('/sort-items', (req, res) => taskController.createSortItem(req, res));

// GET/PUT/DELETE /api/task-constructions/:id
router.get('/task-constructions/:id', (req, res) => taskController.getConstruction(req, res));
router.put('/task-constructions/:id', (req, res) => taskController.updateConstruction(req, res));
router.delete('/task-constructions/:id', (req, res) => taskController.deleteConstruction(req, res));

// GET/PUT/DELETE /api/find-odd-items/:id
router.get('/find-odd-items/:id', (req, res) => taskController.getFindOddItem(req, res));
router.put('/find-odd-items/:id', (req, res) => taskController.updateFindOddItem(req, res));
router.delete('/find-odd-items/:id', (req, res) => taskController.deleteFindOddItem(req, res));

// GET/PUT/DELETE /api/match-pairs/:id
router.get('/match-pairs/:id', (req, res) => taskController.getMatchPair(req, res));
router.put('/match-pairs/:id', (req, res) => taskController.updateMatchPair(req, res));
router.delete('/match-pairs/:id', (req, res) => taskController.deleteMatchPair(req, res));

// GET/PUT/DELETE /api/sequence-items/:id
router.get('/sequence-items/:id', (req, res) => taskController.getSequenceItem(req, res));
router.put('/sequence-items/:id', (req, res) => taskController.updateSequenceItem(req, res));
router.delete('/sequence-items/:id', (req, res) => taskController.deleteSequenceItem(req, res));

// GET/PUT/DELETE /api/sort-items/:id
router.get('/sort-items/:id', (req, res) => taskController.getSortItem(req, res));
router.put('/sort-items/:id', (req, res) => taskController.updateSortItem(req, res));
router.delete('/sort-items/:id', (req, res) => taskController.deleteSortItem(req, res));

export default router;
