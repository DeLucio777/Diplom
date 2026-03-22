import { Request, Response } from 'express';
import UserRepository from '../../repositories/UserRepository';

class UserController {
    private userRepo: UserRepository;

    constructor() {
        this.userRepo = new UserRepository();
    }

    async getAll(req: Request, res: Response): Promise<void> {
        try {
            const users = await this.userRepo.getAll();
            res.json(users);
        } catch (error) {
            console.error('Error fetching users:', error);
            res.status(500).json({ error: 'Failed to fetch users' });
        }
    }

    async getById(req: Request, res: Response): Promise<void> {
        try {
            const id = parseInt(req.params.id);
            const user = await this.userRepo.getById(id);
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
