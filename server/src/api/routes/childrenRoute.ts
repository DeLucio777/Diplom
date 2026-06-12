import { Router } from 'express';
import ChildrenController from '../controllers/ChildrenController';

const router = Router();
const childrenController = new ChildrenController();

// GET /api/children
router.get('/', (req, res) => childrenController.getAll(req, res));

// GET /api/children/:id
router.get('/:id', (req, res) => childrenController.getById(req, res));

// GET /api/children/educator/:educatorId
router.get('/educator/:educatorId', (req, res) => childrenController.getByEducator(req, res));

// POST /api/children
router.post('/', (req, res) => childrenController.create(req, res));

// PUT /api/children/:id
router.put('/:id', (req, res) => childrenController.update(req, res));

// DELETE /api/children/:id
router.delete('/:id', (req, res) => childrenController.delete(req, res));

export default router;
