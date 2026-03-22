import { Request, Response } from 'express';
import MediaRepository from '../../repositories/MediaRepository';

class MediaController {
    private mediaRepo: MediaRepository;

    constructor() {
        this.mediaRepo = new MediaRepository();
    }

    async getAll(req: Request, res: Response): Promise<void> {
        try {
            const media = await this.mediaRepo.getAll();
            res.json(media);
        } catch (error) {
            console.error('Error fetching media:', error);
            res.status(500).json({ error: 'Failed to fetch media' });
        }
    }

    async getById(req: Request, res: Response): Promise<void> {
        try {
            const id = parseInt(req.params.id);
            const media = await this.mediaRepo.getById(id);
            if (!media) {
                res.status(404).json({ error: 'Media not found' });
                return;
            }
            res.json(media);
        } catch (error) {
            console.error('Error fetching media:', error);
            res.status(500).json({ error: 'Failed to fetch media' });
        }
    }
}

export default MediaController;
