import { Router } from 'express';
import ChildrenController from '../controllers/ChildrenController';
import SensoryProfileController from '../controllers/SensoryProfileController';

const router = Router();
const childrenController = new ChildrenController();
const sensoryProfileController = new SensoryProfileController();

// GET /api/children
router.get('/', (req, res) => childrenController.getAll(req, res));

// GET /api/children/:id
router.get('/:id', (req, res) => childrenController.getById(req, res));

// GET /api/children/educator/:educatorId
router.get('/educator/:educatorId', (req, res) => childrenController.getByEducator(req, res));

// GET /api/children/representative/:representativeId
router.get('/representative/:representativeId', (req, res) => childrenController.getByRepresentative(req, res));

// GET /api/children/:childId/sensory-profile
router.get('/:childId/sensory-profile', (req, res) => sensoryProfileController.getByChild(req, res));

// POST /api/children
router.post('/', (req, res) => childrenController.create(req, res));

// POST /api/children/:childId/sensory-profile
router.post('/:childId/sensory-profile', (req, res) => sensoryProfileController.create(req, res));

// PUT /api/children/:id
router.put('/:id', (req, res) => childrenController.update(req, res));

// DELETE /api/children/:id
router.delete('/:id', (req, res) => childrenController.delete(req, res));

export default router;