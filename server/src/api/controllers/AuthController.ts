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
            console.log(login, password);
            if (!login || !password) {
                res.json(false);
                return;
            }
            
            const user = await this.userService.login(login, password);
            
            if (!user) {
                res.json(false);
                return;
            }
            
            res.json(true);
        } catch (error) {
            console.error('Error during login:', error);
            res.json(false);
        }
    }
}

export default AuthController;
