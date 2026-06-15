import { Request, Response } from 'express';
import ChildrenService from '../../services/ChildrenService';

class ChildrenController {
    private childrenService: ChildrenService;

    constructor() {
        this.childrenService = new ChildrenService();
    }

    async getAll(req: Request, res: Response): Promise<void> {
        try {
            const children = await this.childrenService.getAll();
            res.json(children);
        } catch (error) {
            res.status(500).json({ error: 'Failed to get children' });
        }
    }

    async getById(req: Request, res: Response): Promise<void> {
        try {
            const id = parseInt(req.params.id);
            const child = await this.childrenService.getById(id);
            if (child) {
                res.json(child);
            } else {
                res.status(404).json({ error: 'Child not found' });
            }
        } catch (error) {
            res.status(500).json({ error: 'Failed to get child' });
        }
    }

    async getByEducator(req: Request, res: Response): Promise<void> {
        try {
            const educatorId = parseInt(req.params.educatorId);
            const children = await this.childrenService.getByEducator(educatorId);
            res.json(children);
        } catch (error) {
            res.status(500).json({ error: 'Failed to get children by educator' });
        }
    }

    async create(req: Request, res: Response): Promise<void> {
        try {
            const child = await this.childrenService.create(this.normalizePayload(req.body));
            if (child) {
                res.status(201).json(child);
            } else {
                res.status(400).json({ error: 'Failed to create child' });
            }
        } catch (error) {
            res.status(500).json({ error: 'Failed to create child' });
        }
    }

    async update(req: Request, res: Response): Promise<void> {
        try {
            const id = parseInt(req.params.id);
            const child = await this.childrenService.update(id, this.normalizePayload(req.body));
            if (child) {
                res.json(child);
            } else {
                res.status(404).json({ error: 'Child not found' });
            }
        } catch (error) {
            res.status(500).json({ error: 'Failed to update child' });
        }
    }

    async delete(req: Request, res: Response): Promise<void> {
        try {
            const id = parseInt(req.params.id);
            await this.childrenService.delete(id);
            res.status(204).send();
        } catch (error) {
            res.status(500).json({ error: 'Failed to delete child' });
        }
    }

    private normalizePayload(body: any): any {
        const childInfo = { ...(body.ChildInfo || {}) };

        if (body.FullName) {
            const [first_name, second_name] = body.FullName.split(' ');
            body.first_name = first_name;
            body.second_name = second_name || null;
        }

        if (body.email !== undefined) {
            body.email = body.email;
        }

        if (body.phone !== undefined) {
            body.phone = body.phone;
        }

        if (body.FK_disease_id !== undefined) {
            childInfo.FK_disease_id = body.FK_disease_id;
        }

        if (body.age !== undefined) {
            childInfo.age = body.age;
        }

        if (body.speak_level !== undefined) {
            childInfo.speak_level = body.speak_level;
        }

        return { ...body, ChildInfo: childInfo };
    }
}

export default ChildrenController;