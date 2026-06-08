import { Router } from 'express';
import EducatorsController from '../controllers/EducatorsController';

const router = Router();
const educatorsController = new EducatorsController();

// GET /api/educators
router.get('/', (req, res) => educatorsController.getAll(req, res));

// GET /api/educators/:id
router.get('/:id', (req, res) => educatorsController.getById(req, res));

// GET /api/educators/user/:userId
router.get('/user/:userId', (req, res) => educatorsController.getByUser(req, res));

// POST /api/educators
router.post('/', (req, res) => educatorsController.create(req, res));

// PUT /api/educators/:id
router.put('/:id', (req, res) => educatorsController.update(req, res));

// DELETE /api/educators/:id
router.delete('/:id', (req, res) => educatorsController.delete(req, res));

export default router;