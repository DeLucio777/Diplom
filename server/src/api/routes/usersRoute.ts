import { Router } from 'express';
import UserController from '../controllers/UserController';
import UserService from '../../services/UserService';
import AuthController from "../controllers/AuthController";

const authController = new AuthController();

const router = Router();
const userController = new UserController();
const userService = new UserService();

// GET /api/users 
router.get('/', (req, res) => userController.getAll(req, res));

// GET /api/users/:id 
router.get('/:id', (req, res) => userController.getById(req, res));

// POST /api/users/login
router.post('/login', (req, res) => authController.login(req, res));


export default router;
