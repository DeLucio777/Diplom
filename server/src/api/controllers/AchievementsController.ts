import { Request, Response } from 'express';
import AchievementsService from '../../services/AchievementsService';

class AchievementsController {
    private achievementsService: AchievementsService;

    constructor() {
        this.achievementsService = new AchievementsService();
    }

    async getAll(req: Request, res: Response): Promise<void> {
        try {
            const achievements = await this.achievementsService.getAll();
            res.json(achievements);
        } catch (error) {
            res.status(500).json({ error: 'Failed to get achievements' });
        }
    }

    async getByUser(req: Request, res: Response): Promise<void> {
        try {
            const userId = parseInt(req.params.userId);
            const userAchievements = await this.achievementsService.getByUser(userId);
            res.json(userAchievements);
        } catch (error) {
            res.status(500).json({ error: 'Failed to get achievements by user' });
        }
    }

    async award(req: Request, res: Response): Promise<void> {
        try {
            const achievement = await this.achievementsService.award(req.body);
            if (achievement) {
                res.status(201).json(achievement);
            } else {
                res.status(400).json({ error: 'Failed to award achievement' });
            }
        } catch (error) {
            res.status(500).json({ error: 'Failed to award achievement' });
        }
    }
}

export default AchievementsController;