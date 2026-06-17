import { Request, Response } from 'express';
import MediaService from '../../services/MediaService';

class MediaController {
    private mediaService: MediaService;

    constructor() {
        this.mediaService = new MediaService();
    }

    async getAll(req: Request, res: Response): Promise<void> {
        try {
            const media = await this.mediaService.getAll();
            res.json(media);
        } catch (error) {
            console.error('Error fetching media:', error);
            res.status(500).json({ error: 'Failed to fetch media' });
        }
    }

    async getById(req: Request, res: Response): Promise<void> {
        try {
            const id = parseInt(req.params.id);
            const media = await this.mediaService.getById(id);
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
    async upload(req: Request, res: Response): Promise<void> {
        try {
            const file = req.file as any;
            const description = req.body.description;

            if (!file) {
                res.status(400).json({ error: 'File is required' });
                return;
            }

            const saved = await this.mediaService.saveFile(file, description);
            res.json(saved);
        } catch (error) {
            console.error('Error uploading media:', error);
            res.status(500).json({ error: 'Failed to upload media' });
        }
    }

    async update(req: Request, res: Response): Promise<void> {
        try {
            const id = parseInt(req.params.id);
            const updated = await this.mediaService.update(id, {
                PK_MediaId: id,
                FileType: req.body.FileType ?? req.body.fileType,
                FilePath: null,
                Descripti: req.body.Descripti ?? req.body.description
            });

            if (!updated) {
                res.status(404).json({ error: 'Media not found' });
                return;
            }

            const media = await this.mediaService.getById(id);
            res.json(media);
        } catch (error) {
            console.error('Error updating media:', error);
            res.status(500).json({ error: 'Failed to update media' });
        }
    }

    async delete(req: Request, res: Response): Promise<void> {
        try {
            const id = parseInt(req.params.id);
            const deleted = await this.mediaService.delete(id);
            if (!deleted) {
                res.status(404).json({ error: 'Media not found' });
                return;
            }
            res.json({ success: true });
        } catch (error) {
            console.error('Error deleting media:', error);
            res.status(500).json({ error: 'Failed to delete media' });
        }
    }
}

export default MediaController;
