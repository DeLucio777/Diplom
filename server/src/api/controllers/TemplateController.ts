import { Request, Response } from 'express';
import TaskTemplateRepository from '../../repositories/TaskTemplateRepository';

class TemplateController {
    private templateRepo: TaskTemplateRepository;

    constructor() {
        this.templateRepo = new TaskTemplateRepository();
    }

    async getAll(req: Request, res: Response): Promise<void> {
        try {
            const templates = await this.templateRepo.getAll();
            res.json(templates);
        } catch (error) {
            console.error('Error fetching templates:', error);
            res.status(500).json({ error: 'Failed to fetch templates' });
        }
    }

    async getById(req: Request, res: Response): Promise<void> {
        try {
            const id = parseInt(req.params.id);
            const template = await this.templateRepo.getById(id);
            if (!template) {
                res.status(404).json({ error: 'Template not found' });
                return;
            }
            res.json(template);
        } catch (error) {
            console.error('Error fetching template:', error);
            res.status(500).json({ error: 'Failed to fetch template' });
        }
    }
}

export default TemplateController;
