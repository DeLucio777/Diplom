import { Request, Response } from 'express';
import AchievementsService from '../../services/AchievementsService';
import UsersAchievement from '../../entities/usersAchievement';

class UserAchievementsController {
    private achievementsService: AchievementsService;

    constructor() {
        this.achievementsService = new AchievementsService();
    }

    async getAll(req: Request, res: Response): Promise<void> {
        try {
            const userAchievements = await this.achievementsService.getAllUserAchievements();
            res.json(userAchievements);
        } catch (error) {
            console.error('Error fetching user achievements:', error);
            res.status(500).json({ error: 'Failed to fetch user achievements' });
        }
    }

    async getByUser(req: Request, res: Response): Promise<void> {
        try {
            const userId = parseInt(req.params.userId);
            const userAchievements = await this.achievementsService.getByUser(userId);
            res.json(userAchievements);
        } catch (error) {
            console.error('Error fetching user achievements by user:', error);
            res.status(500).json({ error: 'Failed to fetch user achievements by user' });
        }
    }

    async award(req: Request, res: Response): Promise<void> {
        try {
            const body = req.body as any;
            const userId = body?.user_id ?? body?.userId;
            const achievementId =
                body?.achivement_id ??
                body?.achievementId ??
                body?.achievement_id ??
                body?.achievement?.id ??
                body?.Achievement?.id;

            if (!userId || !achievementId) {
                res.status(400).json({ error: 'userId and achievementId are required' });
                return;
            }

            const achievement = {
                ...body,
                user_id: userId,
                achivement_id: achievementId
            } as UsersAchievement;

            const awarded = await this.achievementsService.award(achievement);
            if (!awarded) {
                res.status(400).json({ error: 'Failed to award achievement' });
                return;
            }
            res.status(201).json(awarded);
        } catch (error) {
            console.error('Error awarding achievement:', error);
            res.status(500).json({ error: 'Failed to award achievement' });
        }
    }
}

export default UserAchievementsController;
