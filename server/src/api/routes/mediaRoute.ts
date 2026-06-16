import { Router } from 'express';
import MediaController from '../controllers/MediaController';

const router = Router();
const mediaController = new MediaController();

// GET/POST /api/media
router.get('/', (req, res) => mediaController.getAll(req, res));
router.post('/', (req, res) => mediaController.upload(req, res));

// GET/PUT/DELETE /api/media/:id
router.get('/:id', (req, res) => mediaController.getById(req, res));
router.put('/:id', (req, res) => mediaController.update(req, res));
router.delete('/:id', (req, res) => mediaController.delete(req, res));

export default router;
