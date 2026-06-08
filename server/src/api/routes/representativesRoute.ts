import { Router } from 'express';
import RepresentativesController from '../controllers/RepresentativesController';

const router = Router();
const representativesController = new RepresentativesController();

// GET /api/representatives
router.get('/', (req, res) => representativesController.getAll(req, res));

// GET /api/representatives/user/:userId
router.get('/user/:userId', (req, res) => representativesController.getByUser(req, res));

// POST /api/representatives
router.post('/', (req, res) => representativesController.create(req, res));

// DELETE /api/representatives/:id
router.delete('/:id', (req, res) => representativesController.delete(req, res));

export default router;