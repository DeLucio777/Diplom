import { Request, Response } from 'express';
import DiseasesService from '../../services/DiseasesService';

class DiseasesController {
    private diseasesService: DiseasesService;

    constructor() {
        this.diseasesService = new DiseasesService();
    }

    async getAll(req: Request, res: Response): Promise<void> {
        try {
            const diseases = await this.diseasesService.getAll();
            res.json(diseases);
        } catch (error) {
            res.status(500).json({ error: 'Failed to get diseases' });
        }
    }
}

export default DiseasesController;