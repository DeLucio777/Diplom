import { Request, Response } from 'express';
import UserService from '../../services/UserService';

class AuthController {
    private userService: UserService;

    constructor() {
        this.userService = new UserService();
    }

    async login(req: Request, res: Response): Promise<void> {
        try {
            const { login, password } = req.body;
            
            if (!login || !password) {
                res.sendStatus(401);
                return;
            }
            
            const user = await this.userService.login(login, password);
            
            if (!user) {
                res.sendStatus(401);
                return;
            }
            
            res.json(user);
        } catch (error) {
            console.error('Error during login:', error);
            res.sendStatus(401);
        }
    }
}

export default AuthController;
