import { Router } from 'express';
import UserController from '../controllers/UserController';
import UserInfoController from '../controllers/UserInfoController';
import UserService from '../../services/UserService';
import AuthController from "../controllers/AuthController";

const authController = new AuthController();

const router = Router();
const userController = new UserController();
const userService = new UserService();
const userInfoController = new UserInfoController();

// 1) Специфичные маршруты
router.post('/login', (req, res) => authController.login(req, res));
router.get('/:userId/info', (req, res) => userInfoController.getByUser(req, res));
router.post('/:userId/info', (req, res) => userInfoController.create(req, res));

// 2) Общие маршруты
router.get('/', (req, res) => userController.getAll(req, res));
router.get('/:id', (req, res) => userController.getById(req, res));
export default router;
