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

    async getByLogin(req: Request, res: Response): Promise<void> {
        try {
            const login = req.params.login;
            const user = await this.userService.findByLogin(login);
            res.json(user);
        } catch (error) {
            console.error('Error fetching user by login:', error);
            res.status(500).json({ error: 'Failed to fetch user by login' });
        }
    }

    async update(req: Request, res: Response): Promise<void> {
        try {
            const id = parseInt(req.params.id);
            const user = await this.userService.update(id, req.body);
            if (!user) {
                res.status(404).json({ error: 'User not found' });
                return;
            }
            res.json(user);
        } catch (error) {
            console.error('Error updating user:', error);
            res.status(500).json({ error: 'Failed to update user' });
        }
    }

    async delete(req: Request, res: Response): Promise<void> {
        try {
            const id = parseInt(req.params.id);
            const deleted = await this.userService.delete(id);
            if (!deleted) {
                res.status(404).json({ error: 'User not found or cannot be deleted because related records exist' });
                return;
            }
            res.status(204).send();
        } catch (error) {
            console.error('Error deleting user:', error);
            res.status(500).json({ error: 'Failed to delete user' });
        }
    }
}

export default UserController;
