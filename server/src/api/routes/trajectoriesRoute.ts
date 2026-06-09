import { Router } from 'express';
import TrajectoriesController from '../controllers/TrajectoriesController';

const router = Router();
const trajectoriesController = new TrajectoriesController();

// GET /api/trajectories
router.get('/', (req, res) => trajectoriesController.getAll(req, res));

// GET /api/trajectories/:id/steps
router.get('/:id/steps', (req, res) => trajectoriesController.getSteps(req, res));

// POST /api/trajectories
router.post('/', (req, res) => trajectoriesController.create(req, res));

export default router;