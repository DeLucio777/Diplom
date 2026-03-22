import { Router } from 'express';
import PecsController from '../controllers/PecsController';

const router = Router();
const pecsController = new PecsController();

// GET /api/pecs - Get all PECS items
router.get('/', (req, res) => pecsController.getAll(req, res));

// GET /api/pecs/:id - Get PECS by ID
router.get('/:id', (req, res) => pecsController.getById(req, res));

export default router;
