import { Request, Response } from 'express';
import SensoryProfileService from '../../services/SensoryProfileService';

class SensoryProfileController {
    private sensoryProfileService: SensoryProfileService;

    constructor() {
        this.sensoryProfileService = new SensoryProfileService();
    }

    async getByChild(req: Request, res: Response): Promise<void> {
        try {
            const childId = parseInt(req.params.childId);
            const profile = await this.sensoryProfileService.getByChild(childId);
            if (profile) {
                res.json(profile);
            } else {
                res.status(404).json({ error: 'Sensory profile not found' });
            }
        } catch (error) {
            res.status(500).json({ error: 'Failed to get sensory profile' });
        }
    }

    async create(req: Request, res: Response): Promise<void> {
        try {
            const childId = parseInt(req.params.childId);
            const profile = await this.sensoryProfileService.create(childId, req.body);
            if (profile) {
                res.status(201).json(profile);
            } else {
                res.status(400).json({ error: 'Failed to create sensory profile' });
            }
        } catch (error) {
            res.status(500).json({ error: 'Failed to create sensory profile' });
        }
    }
}

export default SensoryProfileController;