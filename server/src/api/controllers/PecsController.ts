import { Request, Response } from 'express';
import PECSRepository from '../../repositories/PECSRepository';

class PecsController {
    private pecsRepo: PECSRepository;

    constructor() {
        this.pecsRepo = new PECSRepository();
    }

    async getAll(req: Request, res: Response): Promise<void> {
        try {
            const pecs = await this.pecsRepo.getAll();
            res.json(pecs);
        } catch (error) {
            console.error('Error fetching PECS:', error);
            res.status(500).json({ error: 'Failed to fetch PECS' });
        }
    }

    async getById(req: Request, res: Response): Promise<void> {
        try {
            const id = parseInt(req.params.id);
            const pecs = await this.pecsRepo.getById(id);
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
}

export default PecsController;
