import { Request, Response } from 'express';
import UserService from '../../services/UserService';

class AuthController {
    private userService: UserService;

    constructor() {
        this.userService = new UserService();
    }

    async login(req: Request, res: Response): Promise<boolean> {
        try {
            const { login, password } = req.body;
            if (!login || !password) {
                res.json(false);
                return;
            }
            
            const user = await this.userService.login(login, password);
            
            if (!user) {
                res.json(false);
                return;
            }
            console.log(user.Role);
            res.json(user);
        } catch (error) {
            console.error('Error during login:', error);
            res.json(false);
        }
    }

    async register(req: Request, res: Response): Promise<void> {
        try {
            const { login, password, roleId, first_name, second_name, phone } = req.body;
            console.log(`reister with: ${login} ${roleId} ${first_name} ${second_name} ${phone}`);
            if (!login || !password || !roleId) {
                res.status(400).json({ error: 'Missing required fields' });
                return;
            }
                
            const user = await this.userService.create({
                PK_UserId: 0,
                UserLogin: login,
                UserPassword: password,
                FK_RoleId: roleId,
                first_name,
                second_name,
                phone
            } as any);
            
            if (!user) {
                res.status(500).json({ error: 'Failed to create user' });
                return;
            }
            
            res.status(201).json(user);
        } catch (error) {
            console.error('Error during registration:', error);
            res.status(500).json({ error: 'Failed to register user' });
        }
    }
}

export default AuthController;
