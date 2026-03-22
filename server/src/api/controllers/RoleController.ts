import { Request, Response } from 'express';
import RoleService from '../../services/RoleService';

class RoleController {
    private roleService: RoleService;

    constructor() {
        this.roleService = new RoleService();
    }

    async getAll(req: Request, res: Response): Promise<void> {
        try {
            const roles = await this.roleService.getAll();
            res.json(roles);
        } catch (error) {
            console.error('Error fetching roles:', error);
            res.status(500).json({ error: 'Failed to fetch roles' });
        }
    }

    async getById(req: Request, res: Response): Promise<void> {
        try {
            const id = parseInt(req.params.id);
            const role = await this.roleService.getById(id);
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
