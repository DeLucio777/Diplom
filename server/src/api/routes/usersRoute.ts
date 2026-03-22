import { Router } from 'express';
import UserController from '../controllers/UserController';

const router = Router();
const userController = new UserController();

// GET /api/users - Get all users
router.get('/', (req, res) => userController.getAll(req, res));

// GET /api/users/:id - Get user by ID
router.get('/:id', (req, res) => userController.getById(req, res));

export default router;
