import { Request, Response } from 'express';
import UserService from '../../services/UserService';
import UserInfoRepository from '../../repositories/UserInfoRepository';
import TeacherInfoRepository from '../../repositories/TeacherInfoRepository';

class AuthController {
    private userService: UserService;
    private userInfoRepository: UserInfoRepository;
    private teacherInfoRepository: TeacherInfoRepository;

    constructor() {
        this.userService = new UserService();
        this.userInfoRepository = new UserInfoRepository();
        this.teacherInfoRepository = new TeacherInfoRepository();
    }

    async login(req: Request, res: Response): Promise<boolean> {
        try {
            const { login, password } = req.body;
            if (!login || !password) {
                res.json(false);
                return false;
            }

            const user = await this.userService.login(login, password);

            if (!user) {
                res.json(false);
                return false;
            }
            res.json(user);
            return true;
        } catch (error) {
            console.error('Error during login:', error);
            res.json(false);
            return false;
        }
    }

    async register(req: Request, res: Response): Promise<void> {
        try {
            const { login, password, roleId, first_name, second_name, phone, email } = req.body;
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
                phone,
                email
            } as any);

            if (!user) {
                res.status(500).json({ error: 'Failed to create user' });
                return;
            }

            if (roleId === 1) {
                await this.userInfoRepository.save(user.PK_UserId, {});
            } else if (roleId === 2) {
                await this.teacherInfoRepository.save(user.PK_UserId, {});
            }

            res.status(201).json(user);
        } catch (error) {
            console.error('Error during registration:', error);
            res.status(500).json({ error: 'Failed to register user' });
        }
    }
}

export default AuthController;
