import { Request, Response } from 'express';
import UserService from '../../services/UserService';

class UserController {
    private userService: UserService;

    constructor() {
        this.userService = new UserService();
    }

    async getAll(req: Request, res: Response): Promise<void> {
        try {
            const users = await this.userService.getAll();
            res.json(users);
        } catch (error) {
            console.error('Error fetching users:', error);
            res.status(500).json({ error: 'Failed to fetch users' });
        }
    }

    async getById(req: Request, res: Response): Promise<void> {
        try {
            const id = parseInt(req.params.id);
            const user = await this.userService.getById(id);
            if (!user) {
                res.status(404).json({ error: 'User not found' });
                return;
            }
            res.json(user);
        } catch (error) {
            console.error('Error fetching user:', error);
            res.status(500).json({ error: 'Failed to fetch user' });
        }
    }
}

export default UserController;
