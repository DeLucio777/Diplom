import { Request, Response } from 'express';
import UserInfoService from '../../services/UserInfoService';

class ChildInfoController {
    private childInfoService: UserInfoService;

    constructor() {
        this.childInfoService = new UserInfoService();
    }

    async getAll(req: Request, res: Response): Promise<void> {
        try {
            const childInfo = await this.childInfoService.getAll();
            res.json(childInfo);
        } catch (error) {
            console.error('Error fetching child info:', error);
            res.status(500).json({ error: 'Failed to fetch child info' });
        }
    }

    async getById(req: Request, res: Response): Promise<void> {
        try {
            const id = parseInt(req.params.id);
            const childInfo = await this.childInfoService.getById(id);
            if (!childInfo) {
                res.status(404).json({ error: 'Child info not found' });
                return;
            }
            res.json(childInfo);
        } catch (error) {
            console.error('Error fetching child info:', error);
            res.status(500).json({ error: 'Failed to fetch child info' });
        }
    }

    async getByUser(req: Request, res: Response): Promise<void> {
        try {
            const userId = parseInt(req.params.userId);
            const childInfo = await this.childInfoService.getByUser(userId);
            if (!childInfo) {
                res.status(404).json({ error: 'Child info not found' });
                return;
            }
            res.json(childInfo);
        } catch (error) {
            console.error('Error fetching child info by user:', error);
            res.status(500).json({ error: 'Failed to fetch child info by user' });
        }
    }

    async save(req: Request, res: Response): Promise<void> {
        try {
            const userId = parseInt(req.params.userId || req.body.FK_user_id || req.body.userId);
            if (!userId) {
                res.status(400).json({ error: 'userId is required' });
                return;
            }

            const childInfo = await this.childInfoService.save(userId, req.body);
            if (!childInfo) {
                res.status(400).json({ error: 'Failed to save child info' });
                return;
            }
            res.status(201).json(childInfo);
        } catch (error) {
            console.error('Error saving child info:', error);
            res.status(500).json({ error: 'Failed to save child info' });
        }
    }
}

export default ChildInfoController;
