import { Router, Request, Response } from 'express';
import PECSRepository from '../../repositories/PECSRepository';

const router = Router();
const pecsRepo = new PECSRepository();

// GET /api/pecs - Get all PECS items
router.get('/', async (req: Request, res: Response) => {
    try {
        const pecs = await pecsRepo.getAll();
        res.json(pecs);
    } catch (error) {
        console.error('Error fetching PECS:', error);
        res.status(500).json({ error: 'Failed to fetch PECS' });
    }
});

// GET /api/pecs/:id - Get PECS by ID
router.get('/:id', async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id);
        const pecs = await pecsRepo.getById(id);
        if (!pecs) {
            return res.status(404).json({ error: 'PECS not found' });
        }
        res.json(pecs);
    } catch (error) {
        console.error('Error fetching PECS:', error);
        res.status(500).json({ error: 'Failed to fetch PECS' });
    }
});

export default router;
