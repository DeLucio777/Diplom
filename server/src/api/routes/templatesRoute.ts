import { Router } from 'express';
import TemplateController from '../controllers/TemplateController';

const router = Router();
const templateController = new TemplateController();

// GET /api/templates - Get all templates
router.get('/', (req, res) => templateController.getAll(req, res));

// GET /api/templates/:id - Get template by ID
router.get('/:id', (req, res) => templateController.getById(req, res));

export default router;
