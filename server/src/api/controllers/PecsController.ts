import { Request, Response } from 'express';
import PecsService from '../../services/PecsService';

class PecsController {
    private pecsService: PecsService;

    constructor() {
        this.pecsService = new PecsService();
    }

    async getAll(req: Request, res: Response): Promise<void> {
        try {
            const pecs = await this.pecsService.getAll();
            res.json(pecs);
        } catch (error) {
            console.error('Error fetching PECS:', error);
            res.status(500).json({ error: 'Failed to fetch PECS' });
        }
    }

    async getById(req: Request, res: Response): Promise<void> {
        try {
            const id = parseInt(req.params.id);
            const pecs = await this.pecsService.getById(id);
            if (!pecs) {
                res.status(404).json({ error: 'PECS not found' });
                return;
            }
            res.json(pecs);
        } catch (error) {
            console.error('Error fetching PECS:', error);
            res.status(500).json({ error: 'Failed to fetch PECS' });
        }
    }

    async upload(req: Request, res: Response): Promise<void> {
        try {
            const file = req.file as any;
            const description = req.body.description;
            const category = req.body.category;

            if (!file) {
                res.status(400).json({ error: 'File is required' });
                return;
            }

            if (!category) {
                res.status(400).json({ error: 'Category is required' });
                return;
            }

            const saved = await this.pecsService.saveFile(file, description, category);
            res.json(saved);
        } catch (error) {
            console.error('Error uploading PECS:', error);
            res.status(500).json({ error: 'Failed to upload PECS' });
        }
    }

    async update(req: Request, res: Response): Promise<void> {
        try {
            const id = parseInt(req.params.id);
            console.log('updating PECS: ',  {
                PK_PECSid: id,
                Descripti: req.body.Descripti ?? req.body.description,
                Category: req.body.Category ?? req.body.category
            });
            const updated = await this.pecsService.update(id, {
                PK_PECSid: id,
                Descripti: req.body.Descripti ?? req.body.description,
                filePath: null,
                Category: req.body.Category ?? req.body.category
            });

            if (!updated) {
                res.status(404).json({ error: 'PECS not found' });
                return;
            }
            
            const pecs = await this.pecsService.getById(id);
            res.json(pecs);
        } catch (error) {
            console.error('Error updating PECS:', error);
            res.status(500).json({ error: 'Failed to update PECS' });
        }
    }

    async delete(req: Request, res: Response): Promise<void> {
        try {
            const id = parseInt(req.params.id);
            const deleted = await this.pecsService.delete(id);
            if (!deleted) {
                res.status(404).json({ error: 'PECS not found' });
                return;
            }
            res.json({ success: true });
        } catch (error) {
            console.error('Error deleting PECS:', error);
            res.status(500).json({ error: 'Failed to delete PECS' });
        }
    }
}

export default PecsController;
