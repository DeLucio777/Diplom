import { Router, Request, Response } from 'express';
import RoleRepository from '../../repositories/RoleRepository';

const router = Router();
const roleRepo = new RoleRepository();

// GET /api/roles - Get all roles
router.get('/', async (req: Request, res: Response) => {
    try {
        const roles = await roleRepo.getAll();
        res.json(roles);
    } catch (error) {
        console.error('Error fetching roles:', error);
        res.status(500).json({ error: 'Failed to fetch roles' });
    }
});

// GET /api/roles/:id - Get role by ID
router.get('/:id', async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id);
        const role = await roleRepo.getById(id);
        if (!role) {
            return res.status(404).json({ error: 'Role not found' });
        }
        res.json(role);
    } catch (error) {
        console.error('Error fetching role:', error);
        res.status(500).json({ error: 'Failed to fetch role' });
    }
});

export default router;
