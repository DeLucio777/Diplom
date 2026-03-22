import { Router, Request, Response } from 'express';
import TaskTemplateRepository from '../../repositories/TaskTemplateRepository';

const router = Router();
const templateRepo = new TaskTemplateRepository();

// GET /api/templates - Get all templates
router.get('/', async (req: Request, res: Response) => {
    try {
        const templates = await templateRepo.getAll();
        res.json(templates);
    } catch (error) {
        console.error('Error fetching templates:', error);
        res.status(500).json({ error: 'Failed to fetch templates' });
    }
});

// GET /api/templates/:id - Get template by ID
router.get('/:id', async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id);
        const template = await templateRepo.getById(id);
        if (!template) {
            return res.status(404).json({ error: 'Template not found' });
        }
        res.json(template);
    } catch (error) {
        console.error('Error fetching template:', error);
        res.status(500).json({ error: 'Failed to fetch template' });
    }
});

export default router;
