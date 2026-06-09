import { Request, Response } from 'express';
import RepresentativesService from '../../services/RepresentativesService';

class RepresentativesController {
    private representativesService: RepresentativesService;

    constructor() {
        this.representativesService = new RepresentativesService();
    }

    async getAll(req: Request, res: Response): Promise<void> {
        try {
            const representatives = await this.representativesService.getAll();
            res.json(representatives);
        } catch (error) {
            res.status(500).json({ error: 'Failed to get representatives' });
        }
    }

    async getByUser(req: Request, res: Response): Promise<void> {
        try {
            const userId = parseInt(req.params.userId);
            const representative = await this.representativesService.getByUser(userId);
            if (representative) {
                res.json(representative);
            } else {
                res.status(404).json({ error: 'Representative not found' });
            }
        } catch (error) {
            res.status(500).json({ error: 'Failed to get representative by user' });
        }
    }

    async create(req: Request, res: Response): Promise<void> {
        try {
            const representative = await this.representativesService.create(req.body);
            if (representative) {
                res.status(201).json(representative);
            } else {
                res.status(400).json({ error: 'Failed to create representative' });
            }
        } catch (error) {
            res.status(500).json({ error: 'Failed to create representative' });
        }
    }

    async delete(req: Request, res: Response): Promise<void> {
        try {
            const id = parseInt(req.params.id);
            await this.representativesService.delete(id);
            res.status(204).send();
        } catch (error) {
            res.status(500).json({ error: 'Failed to delete representative' });
        }
    }
}

export default RepresentativesController;