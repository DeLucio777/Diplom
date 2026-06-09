import { Request, Response } from 'express';
import ProgressService from '../../services/ProgressService';

class ProgressController {
    private progressService: ProgressService;

    constructor() {
        this.progressService = new ProgressService();
    }

    async getAll(req: Request, res: Response): Promise<void> {
        try {
            const progress = await this.progressService.getAll();
            res.json(progress);
        } catch (error) {
            res.status(500).json({ error: 'Failed to get progress records' });
        }
    }

    async getByChild(req: Request, res: Response): Promise<void> {
        try {
            const childId = parseInt(req.params.childId);
            const progress = await this.progressService.getByChild(childId);
            res.json(progress);
        } catch (error) {
            res.status(500).json({ error: 'Failed to get progress by child' });
        }
    }

    async create(req: Request, res: Response): Promise<void> {
        try {
            const progress = await this.progressService.create(req.body);
            if (progress) {
                res.status(201).json(progress);
            } else {
                res.status(400).json({ error: 'Failed to create progress record' });
            }
        } catch (error) {
            res.status(500).json({ error: 'Failed to create progress record' });
        }
    }
}

export default ProgressController;