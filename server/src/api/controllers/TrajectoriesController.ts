import { Request, Response } from 'express';
import TrajectoriesService from '../../services/TrajectoriesService';

class TrajectoriesController {
    private trajectoriesService: TrajectoriesService;

    constructor() {
        this.trajectoriesService = new TrajectoriesService();
    }

    async getAll(req: Request, res: Response): Promise<void> {
        try {
            const trajectories = await this.trajectoriesService.getAll();
            res.json(trajectories);
        } catch (error) {
            res.status(500).json({ error: 'Failed to get trajectories' });
        }
    }

    async getSteps(req: Request, res: Response): Promise<void> {
        try {
            const id = parseInt(req.params.id);
            const steps = await this.trajectoriesService.getSteps(id);
            res.json(steps);
        } catch (error) {
            res.status(500).json({ error: 'Failed to get trajectory steps' });
        }
    }

    async create(req: Request, res: Response): Promise<void> {
        try {
            const trajectory = await this.trajectoriesService.create(req.body);
            if (trajectory) {
                res.status(201).json(trajectory);
            } else {
                res.status(400).json({ error: 'Failed to create trajectory' });
            }
        } catch (error) {
            res.status(500).json({ error: 'Failed to create trajectory' });
        }
    }
}

export default TrajectoriesController;