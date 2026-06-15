import { Request, Response } from 'express';
import ProgressService from '../../services/ProgressService';

class ProgressController {
    private progressService: ProgressService;

    constructor() {
        this.progressService = new ProgressService();
    }

    async getAll(req: Request, res: Response): Promise<void> {
        try {
            const userId = req.query.userId ? parseInt(req.query.userId as string) : undefined;
            const progress = await this.progressService.getAll(userId);
            res.json(progress);
        } catch (error) {
            console.error('Error fetching progress:', error);
            res.status(500).json({ error: 'Failed to fetch progress' });
        }
    }
}

export default ProgressController;
