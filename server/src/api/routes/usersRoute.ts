import { Router, Request, Response } from 'express';
import UserRepository from '../../repositories/UserRepository';

const router = Router();
const userRepo = new UserRepository();

// GET /api/users - Get all users
router.get('/', async (req: Request, res: Response) => {
    try {
        const users = await userRepo.getAll();
        res.json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ error: 'Failed to fetch users' });
    }
});

// GET /api/users/:id - Get user by ID
router.get('/:id', async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id);
        const user = await userRepo.getById(id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ error: 'Failed to fetch user' });
    }
});

export default router;
