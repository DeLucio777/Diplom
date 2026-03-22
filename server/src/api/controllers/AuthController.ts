import { Request, Response } from 'express';
import UserRepository from '../../repositories/UserRepository';

class AuthController {
    private userRepo: UserRepository;

    constructor() {
        this.userRepo = new UserRepository();
    }

    async login(req: Request, res: Response): Promise<void> {
        try {
            const { login, password } = req.body;
            
            if (!login || !password) {
                res.status(400).json({ error: 'Login and password are required' });
                return;
            }
            
            const user = await this.userRepo.login(login, password);
            
            if (!user) {
                res.status(401).json({ error: 'Invalid credentials' });
                return;
            }
            
            // Don't return password in response
            const { UserPassword, ...userWithoutPassword } = user as any;
            res.json(userWithoutPassword);
        } catch (error) {
            console.error('Error during login:', error);
            res.status(500).json({ error: 'Login failed' });
        }
    }
}

export default AuthController;
