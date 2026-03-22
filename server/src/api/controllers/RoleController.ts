import { Request, Response } from 'express';
import RoleRepository from '../../repositories/RoleRepository';

class RoleController {
    private roleRepo: RoleRepository;

    constructor() {
        this.roleRepo = new RoleRepository();
    }

    async getAll(req: Request, res: Response): Promise<void> {
        try {
            const roles = await this.roleRepo.getAll();
            res.json(roles);
        } catch (error) {
            console.error('Error fetching roles:', error);
            res.status(500).json({ error: 'Failed to fetch roles' });
        }
    }

    async getById(req: Request, res: Response): Promise<void> {
        try {
            const id = parseInt(req.params.id);
            const role = await this.roleRepo.getById(id);
            if (!role) {
                res.status(404).json({ error: 'Role not found' });
                return;
            }
            res.json(role);
        } catch (error) {
            console.error('Error fetching role:', error);
            res.status(500).json({ error: 'Failed to fetch role' });
        }
    }
}

export default RoleController;
