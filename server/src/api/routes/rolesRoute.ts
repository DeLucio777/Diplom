import { Router } from 'express';
import RoleController from '../controllers/RoleController';

const router = Router();
const roleController = new RoleController();

// GET /api/roles - Get all roles
router.get('/', (req, res) => roleController.getAll(req, res));

// GET /api/roles/:id - Get role by ID
router.get('/:id', (req, res) => roleController.getById(req, res));

export default router;
