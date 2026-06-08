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

// GET /api/users 
router.get('/', (req, res) => userController.getAll(req, res));

// GET /api/users/:id 
router.get('/:id', (req, res) => userController.getById(req, res));

// GET /api/users/:userId/info
router.get('/:userId/info', (req, res) => userInfoController.getByUser(req, res));

// POST /api/users/login
router.post('/login', (req, res) => authController.login(req, res));

// POST /api/users/:userId/info
router.post('/:userId/info', (req, res) => userInfoController.create(req, res));


export default router;
