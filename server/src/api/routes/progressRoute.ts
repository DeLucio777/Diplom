import { Router } from 'express';
import ProgressController from '../controllers/ProgressController';

const router = Router();
const progressController = new ProgressController();

// GET /api/progress
router.get('/', (req, res) => progressController.getAll(req, res));

// GET /api/progress/child/:childId
router.get('/child/:childId', (req, res) => progressController.getByChild(req, res));

// POST /api/progress
router.post('/', (req, res) => progressController.create(req, res));

export default router;