import { Router } from 'express';
import AssignmentsController from '../controllers/AssignmentsController';

const router = Router();
const assignmentsController = new AssignmentsController();

// GET /api/assignments
router.get('/', (req, res) => assignmentsController.getAll(req, res));

// GET /api/assignments/child/:childId
router.get('/child/:childId', (req, res) => assignmentsController.getByChild(req, res));

// POST /api/assignments
router.post('/', (req, res) => assignmentsController.create(req, res));

// PUT /api/assignments/:id/status
router.put('/:id/status', (req, res) => assignmentsController.updateStatus(req, res));

export default router;