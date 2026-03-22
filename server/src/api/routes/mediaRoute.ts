import { Router } from 'express';
import MediaController from '../controllers/MediaController';

const router = Router();
const mediaController = new MediaController();

// GET /api/media - Get all media items
router.get('/', (req, res) => mediaController.getAll(req, res));

// GET /api/media/:id - Get media by ID
router.get('/:id', (req, res) => mediaController.getById(req, res));

export default router;
