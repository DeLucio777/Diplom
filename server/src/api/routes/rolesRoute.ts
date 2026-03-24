import { Router } from 'express';
import RoleController from '../controllers/RoleController';

const router = Router();
const roleController = new RoleController();

// GET /api/roles 
router.get('/', (req, res) => roleController.getAll(req, res));

// GET /api/roles/:id
router.get('/:id', (req, res) => roleController.getById(req, res));

export default router;
