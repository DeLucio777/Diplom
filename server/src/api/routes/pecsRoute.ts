import { Router } from 'express';
import PecsController from '../controllers/PecsController';

const router = Router();
const pecsController = new PecsController();

// GET/POST /api/pecs
router.get('/', (req, res) => pecsController.getAll(req, res));
router.post('/', (req, res) => pecsController.upload(req, res));

// GET/PUT/DELETE /api/pecs/:id
router.get('/:id', (req, res) => pecsController.getById(req, res));
router.put('/:id', (req, res) => pecsController.update(req, res));
router.delete('/:id', (req, res) => pecsController.delete(req, res));

export default router;
