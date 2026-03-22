import { Router, Request, Response } from 'express';
import UserRepository from '../../repositories/UserRepository';

const router = Router();
const userRepo = new UserRepository();

// POST /api/auth/login - Login user
router.post('/login', async (req: Request, res: Response) => {
    try {
        const { login, password } = req.body;
        
        if (!login || !password) {
            return res.status(400).json({ error: 'Login and password are required' });
        }
        
        const user = await userRepo.login(login, password);
        
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        
        // Don't return password in response
        const { UserPassword, ...userWithoutPassword } = user as any;
        res.json(userWithoutPassword);
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ error: 'Login failed' });
    }
});

export default router;
