import { Request, Response } from 'express';
import EducatorsService from '../../services/EducatorsService';

class EducatorsController {
    private educatorsService: EducatorsService;

    constructor() {
        this.educatorsService = new EducatorsService();
    }

    async getAll(req: Request, res: Response): Promise<void> {
        try {
            const educators = await this.educatorsService.getAll();
            res.json(educators);
        } catch (error) {
            res.status(500).json({ error: 'Failed to get educators' });
        }
    }

    async getById(req: Request, res: Response): Promise<void> {
        try {
            const id = parseInt(req.params.id);
            const educator = await this.educatorsService.getById(id);
            if (educator) {
                res.json(educator);
            } else {
                res.status(404).json({ error: 'Educator not found' });
            }
        } catch (error) {
            res.status(500).json({ error: 'Failed to get educator' });
        }
    }

    async getByUser(req: Request, res: Response): Promise<void> {
        try {
            const userId = parseInt(req.params.userId);
            const educator = await this.educatorsService.getByUser(userId);
            if (educator) {
                res.json(educator);
            } else {
                res.status(404).json({ error: 'Educator not found' });
            }
        } catch (error) {
            res.status(500).json({ error: 'Failed to get educator by user' });
        }
    }

    async create(req: Request, res: Response): Promise<void> {
        try {
            const educator = await this.educatorsService.create(req.body);
            if (educator) {
                res.status(201).json(educator);
            } else {
                res.status(400).json({ error: 'Failed to create educator' });
            }
        } catch (error) {
            res.status(500).json({ error: 'Failed to create educator' });
        }
    }

    async update(req: Request, res: Response): Promise<void> {
        try {
            const id = parseInt(req.params.id);
            const educator = await this.educatorsService.update(id, req.body);
            if (educator) {
                res.json(educator);
            } else {
                res.status(404).json({ error: 'Educator not found' });
            }
        } catch (error) {
            res.status(500).json({ error: 'Failed to update educator' });
        }
    }

    async delete(req: Request, res: Response): Promise<void> {
        try {
            const id = parseInt(req.params.id);
            await this.educatorsService.delete(id);
            res.status(204).send();
        } catch (error) {
            res.status(500).json({ error: 'Failed to delete educator' });
        }
    }
}

export default EducatorsController;