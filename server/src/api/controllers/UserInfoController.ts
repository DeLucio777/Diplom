import { Request, Response } from 'express';
import UserInfoService from '../../services/UserInfoService';

class UserInfoController {
    private userInfoService: UserInfoService;

    constructor() {
        this.userInfoService = new UserInfoService();
    }

    async getByUser(req: Request, res: Response): Promise<void> {
        try {
            const userId = parseInt(req.params.userId);
            const userInfo = await this.userInfoService.getByUser(userId);
            if (userInfo) {
                res.json(userInfo);
            } else {
                res.status(404).json({ error: 'User info not found' });
            }
        } catch (error) {
            res.status(500).json({ error: 'Failed to get user info' });
        }
    }

    async create(req: Request, res: Response): Promise<void> {
        try {
            const userId = parseInt(req.params.userId);
            const userInfo = await this.userInfoService.create(userId, req.body);//todo: impliment method
            if (userInfo) {
                res.status(201).json(userInfo);
            } else {
                res.status(400).json({ error: 'Failed to create user info' });
            }
        } catch (error) {
            res.status(500).json({ error: 'Failed to create user info' });
        }
    }
}

export default UserInfoController;