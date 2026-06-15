import { Request, Response } from 'express';
import TeacherInfoService from '../../services/TeacherInfoService';

class TeacherInfoController {
    private teacherInfoService: TeacherInfoService;

    constructor() {
        this.teacherInfoService = new TeacherInfoService();
    }

    async getAll(req: Request, res: Response): Promise<void> {
        try {
            const teacherInfo = await this.teacherInfoService.getAll();
            res.json(teacherInfo);
        } catch (error) {
            console.error('Error fetching teacher info:', error);
            res.status(500).json({ error: 'Failed to fetch teacher info' });
        }
    }

    async getByUser(req: Request, res: Response): Promise<void> {
        try {
            const userId = parseInt(req.params.userId);
            const teacherInfo = await this.teacherInfoService.getByUserId(userId);
            if (!teacherInfo) {
                res.status(404).json({ error: 'Teacher info not found' });
                return;
            }
            res.json(teacherInfo);
        } catch (error) {
            console.error('Error fetching teacher info by user:', error);
            res.status(500).json({ error: 'Failed to fetch teacher info by user' });
        }
    }

    async save(req: Request, res: Response): Promise<void> {
        try {
            const userId = parseInt(req.params.userId || req.body.FK_UserId || req.body.userId);
            if (!userId) {
                res.status(400).json({ error: 'userId is required' });
                return;
            }

            const teacherInfo = await this.teacherInfoService.save(userId, req.body);
            if (!teacherInfo) {
                res.status(400).json({ error: 'Failed to save teacher info' });
                return;
            }
            res.status(201).json(teacherInfo);
        } catch (error) {
            console.error('Error saving teacher info:', error);
            res.status(500).json({ error: 'Failed to save teacher info' });
        }
    }
}

export default TeacherInfoController;
