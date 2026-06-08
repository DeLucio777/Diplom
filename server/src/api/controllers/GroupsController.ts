import { Request, Response } from 'express';
import GroupsService from '../../services/GroupsService';

class GroupsController {
    private groupsService: GroupsService;

    constructor() {
        this.groupsService = new GroupsService();
    }

    async getAll(req: Request, res: Response): Promise<void> {
        try {
            const groups = await this.groupsService.getAll();
            res.json(groups);
        } catch (error) {
            res.status(500).json({ error: 'Failed to get groups' });
        }
    }

    async getByEducator(req: Request, res: Response): Promise<void> {
        try {
            const educatorId = parseInt(req.params.educatorId);
            const groups = await this.groupsService.getByEducator(educatorId);
            res.json(groups);
        } catch (error) {
            res.status(500).json({ error: 'Failed to get groups by educator' });
        }
    }

    async getMembers(req: Request, res: Response): Promise<void> {
        try {
            const groupId = parseInt(req.params.groupId);
            const members = await this.groupsService.getMembers(groupId);
            res.json(members);
        } catch (error) {
            res.status(500).json({ error: 'Failed to get group members' });
        }
    }

    async create(req: Request, res: Response): Promise<void> {
        try {
            const group = await this.groupsService.create(req.body);
            if (group) {
                res.status(201).json(group);
            } else {
                res.status(400).json({ error: 'Failed to create group' });
            }
        } catch (error) {
            res.status(500).json({ error: 'Failed to create group' });
        }
    }

    async delete(req: Request, res: Response): Promise<void> {
        try {
            const id = parseInt(req.params.id);
            await this.groupsService.delete(id);
            res.status(204).send();
        } catch (error) {
            res.status(500).json({ error: 'Failed to delete group' });
        }
    }

    async addMember(req: Request, res: Response): Promise<void> {
        try {
            const groupId = parseInt(req.params.groupId);
            const { childId } = req.body;
            await this.groupsService.addMember(groupId, childId);
            res.status(204).send();
        } catch (error) {
            res.status(500).json({ error: 'Failed to add member to group' });
        }
    }

    async removeMember(req: Request, res: Response): Promise<void> {
        try {
            const groupId = parseInt(req.params.groupId);
            const childId = parseInt(req.params.childId);
            await this.groupsService.removeMember(groupId, childId);
            res.status(204).send();
        } catch (error) {
            res.status(500).json({ error: 'Failed to remove member from group' });
        }
    }
}

export default GroupsController;