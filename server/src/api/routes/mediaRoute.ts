import { Router } from 'express';
import MediaController from '../controllers/MediaController';

const router = Router();
const mediaController = new MediaController();

// GET /api/media
router.get('/', (req, res) => mediaController.getAll(req, res));

// GET /api/media/:id 
router.get('/:id', (req, res) => mediaController.getById(req, res));

export default router;
