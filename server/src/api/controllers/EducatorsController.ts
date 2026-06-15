import { Request, Response } from 'express';
import EducatorsService from '../../services/EducatorsService';

class EducatorsController {
    private educatorsService: EducatorsService;

    constructor() {
        this.educatorsService = new EducatorsService();
    }

    async getAll(req: Request, res: Response): Promise<void> {
        try {
            const educators = await this.educatorsService.getAll();
            res.json(educators);
        } catch (error) {
            res.status(500).json({ error: 'Failed to get educators' });
        }
    }

    async getById(req: Request, res: Response): Promise<void> {
        try {
            const id = parseInt(req.params.id);
            const educator = await this.educatorsService.getById(id);
            if (educator) {
                res.json(educator);
            } else {
                res.status(404).json({ error: 'Educator not found' });
            }
        } catch (error) {
            res.status(500).json({ error: 'Failed to get educator' });
        }
    }

    async getByUser(req: Request, res: Response): Promise<void> {
        try {
            const userId = parseInt(req.params.userId);
            const educator = await this.educatorsService.getByUserId(userId);
            if (educator) {
                res.json(educator);
            } else {
                res.status(404).json({ error: 'Educator not found' });
            }
        } catch (error) {
            res.status(500).json({ error: 'Failed to get educator by user' });
        }
    }

    async create(req: Request, res: Response): Promise<void> {
        try {
            const educator = await this.educatorsService.create(this.normalizePayload(req.body));
            if (educator) {
                res.status(201).json(educator);
            } else {
                res.status(400).json({ error: 'Failed to create educator' });
            }
        } catch (error) {
            res.status(500).json({ error: 'Failed to create educator' });
        }
    }

    async update(req: Request, res: Response): Promise<void> {
        try {
            const id = parseInt(req.params.id);
            const educator = await this.educatorsService.update(id, this.normalizePayload(req.body));
            if (educator) {
                res.json(educator);
            } else {
                res.status(404).json({ error: 'Educator not found' });
            }
        } catch (error) {
            res.status(500).json({ error: 'Failed to update educator' });
        }
    }

    async delete(req: Request, res: Response): Promise<void> {
        try {
            const id = parseInt(req.params.id);
            await this.educatorsService.delete(id);
            res.status(204).send();
        } catch (error) {
            res.status(500).json({ error: 'Failed to delete educator' });
        }
    }

    private normalizePayload(body: any): any {
        const educator = { ...body };
        const user: any = { ...(body.User || {}) };

        if (body.FullName) {
            const [first_name, second_name] = body.FullName.split(' ');
            user.first_name = first_name;
            user.second_name = second_name || null;
        }

        if (body.Phone !== undefined) {
            user.phone = body.Phone;
        }

        if (body.Email !== undefined) {
            user.email = body.Email;
        }

        if (Object.keys(user).length > 0) {
            educator.User = user;
        }

        if (body.Specialization !== undefined) {
            educator.Teacher_Specialization = body.Specialization;
        }

        return educator;
    }
}

export default EducatorsController;