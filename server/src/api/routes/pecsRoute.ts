import { Router } from 'express';
import PecsController from '../controllers/PecsController';

const router = Router();
const pecsController = new PecsController();

// GET /api/pecs 
router.get('/', (req, res) => pecsController.getAll(req, res));

// GET /api/pecs/:id
router.get('/:id', (req, res) => pecsController.getById(req, res));

export default router;
