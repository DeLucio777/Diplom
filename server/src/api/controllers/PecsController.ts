import { Request, Response } from 'express';
import PecsService from '../../services/PecsService';

class PecsController {
    private pecsService: PecsService;

    constructor() {
        this.pecsService = new PecsService();
    }

    async getAll(req: Request, res: Response): Promise<void> {
        console.log('all pecs');
        try {
            const pecs = await this.pecsService.getAll();
            res.json(pecs);
        } catch (error) {
            console.error('Error fetching PECS:', error);
            res.status(500).json({ error: 'Failed to fetch PECS' });
        }
    }

    async getById(req: Request, res: Response): Promise<void> {
        console.log('all pecs by id');
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
}

export default PecsController;
