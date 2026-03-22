import { Router, Request, Response } from 'express';
import MediaRepository from '../../repositories/MediaRepository';

const router = Router();
const mediaRepo = new MediaRepository();

// GET /api/media - Get all media items
router.get('/', async (req: Request, res: Response) => {
    try {
        const media = await mediaRepo.getAll();
        res.json(media);
    } catch (error) {
        console.error('Error fetching media:', error);
        res.status(500).json({ error: 'Failed to fetch media' });
    }
});

// GET /api/media/:id - Get media by ID
router.get('/:id', async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id);
        const media = await mediaRepo.getById(id);
        if (!media) {
            return res.status(404).json({ error: 'Media not found' });
        }
        res.json(media);
    } catch (error) {
        console.error('Error fetching media:', error);
        res.status(500).json({ error: 'Failed to fetch media' });
    }
});

export default router;
