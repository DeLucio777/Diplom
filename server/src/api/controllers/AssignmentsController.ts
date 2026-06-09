import { Request, Response } from 'express';
import AssignmentsService from '../../services/AssignmentsService';

class AssignmentsController {
    private assignmentsService: AssignmentsService;

    constructor() {
        this.assignmentsService = new AssignmentsService();
    }

    async getAll(req: Request, res: Response): Promise<void> {
        try {
            const assignments = await this.assignmentsService.getAll();
            res.json(assignments);
        } catch (error) {
            res.status(500).json({ error: 'Failed to get assignments' });
        }
    }

    async getByChild(req: Request, res: Response): Promise<void> {
        try {
            const childId = parseInt(req.params.childId);
            const assignments = await this.assignmentsService.getByChild(childId);
            res.json(assignments);
        } catch (error) {
            res.status(500).json({ error: 'Failed to get assignments by child' });
        }
    }

    async create(req: Request, res: Response): Promise<void> {
        try {
            const assignment = await this.assignmentsService.create(req.body);
            if (assignment) {
                res.status(201).json(assignment);
            } else {
                res.status(400).json({ error: 'Failed to create assignment' });
            }
        } catch (error) {
            res.status(500).json({ error: 'Failed to create assignment' });
        }
    }

    async updateStatus(req: Request, res: Response): Promise<void> {
        try {
            const id = parseInt(req.params.id);
            const { status } = req.body;
            const assignment = await this.assignmentsService.updateStatus(id, status);
            if (assignment) {
                res.json(assignment);
            } else {
                res.status(404).json({ error: 'Assignment not found' });
            }
        } catch (error) {
            res.status(500).json({ error: 'Failed to update assignment status' });
        }
    }
}

export default AssignmentsController;