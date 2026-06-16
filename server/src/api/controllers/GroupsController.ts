import { Request, Response } from 'express';
import GroupsService from '../../services/GroupsService';

class GroupsController {
    private groupsService: GroupsService;

    constructor() {
        this.groupsService = new GroupsService();
    }
    async update(req: Request, res: Response): Promise<void> {
        try {
            const id = Number(req.params.id);

            const updated = await this.groupsService.update({
                PK_Id: id,
                FK_Teacher_id: req.body.FK_Teacher_id,
                GroupName: req.body.GroupName
            });

            if (updated) {
                res.status(200).json({ success: true });
            } else {
                res.status(404).json({ error: 'Group not found' });
            }
        } catch (error) {
            res.status(500).json({ error: 'Failed to update group' });
        }
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

    async getAllMembers(req: Request, res: Response): Promise<void> {
        try {
            const members = await this.groupsService.getAllMembers();
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
            const groupId = parseInt(req.params.groupId || req.body.FK_group_id || req.body.groupId);
            const userId = parseInt(req.body.userId || req.body.FK_user_id);
            const member = await this.groupsService.addMember(groupId, userId);
            if (!member) {
                res.status(400).json({ error: 'Failed to add member to group' });
                return;
            }
            res.status(201).json(member);
        } catch (error) {
            res.status(500).json({ error: 'Failed to add member to group' });
        }
    }

    async removeMember(req: Request, res: Response): Promise<void> {
        try {
            const groupId = parseInt(req.params.groupId);
            const userId = parseInt(req.params.userId);
            await this.groupsService.removeMember(groupId, userId);
            res.status(204).send();
        } catch (error) {
            res.status(500).json({ error: 'Failed to remove member from group' });
        }
    }

    async removeMemberById(req: Request, res: Response): Promise<void> {
        try {
            const memberId = parseInt(req.params.memberId);
            const deleted = await this.groupsService.removeMemberById(memberId);
            if (!deleted) {
                res.status(404).json({ error: 'Group member not found' });
                return;
            }
            res.status(204).send();
        } catch (error) {
            res.status(500).json({ error: 'Failed to remove group member' });
        }
    }
}

export default GroupsController;