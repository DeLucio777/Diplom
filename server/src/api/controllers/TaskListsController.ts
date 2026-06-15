import { Request, Response } from 'express';
import TaskListsService from '../../services/TaskListsService';

class TaskListsController {
    private taskListsService: TaskListsService;

    constructor() {
        this.taskListsService = new TaskListsService();
    }

    async getAll(req: Request, res: Response): Promise<void> {
        try {
            const taskLists = await this.taskListsService.getAll();
            res.json(taskLists);
        } catch (error) {
            res.status(500).json({ error: 'Failed to get task lists' });
        }
    }

    async getByTeacher(req: Request, res: Response): Promise<void> {
        try {
            const teacherId = parseInt(req.params.teacherId);
            const taskLists = await this.taskListsService.getByTeacher(teacherId);
            res.json(taskLists);
        } catch (error) {
            res.status(500).json({ error: 'Failed to get task lists by teacher' });
        }
    }

    async getByUser(req: Request, res: Response): Promise<void> {
        try {
            const userId = parseInt(req.params.userId);
            const taskLists = await this.taskListsService.getByUser(userId);
            res.json(taskLists);
        } catch (error) {
            res.status(500).json({ error: 'Failed to get task lists by user' });
        }
    }

    async getItems(req: Request, res: Response): Promise<void> {
        try {
            const taskListId = parseInt(req.params.taskListId);
            const items = await this.taskListsService.getItems(taskListId);
            res.json(items);
        } catch (error) {
            res.status(500).json({ error: 'Failed to get task list items' });
        }
    }

    async create(req: Request, res: Response): Promise<void> {
        try {
            const body = req.body as any;
            console.log(body);
            const taskList = body.taskList || {
                teacher_id: body.teacher_id ?? body.teacherId,
                date_complite: body.date_complite ?? body.dateComplete
            };
            const taskIds = Array.isArray(body.taskIds) ? body.taskIds : [];
            const userIds = Array.isArray(body.userIds) ? body.userIds : [];

            if (!taskList.teacher_id) {
                res.status(400).json({ error: 'teacher_id is required' });
                return;
            }

            const created = await this.taskListsService.create(taskList, taskIds, userIds);
            if (created) {
                res.status(201).json(created);
            } else {
                res.status(400).json({ error: 'Failed to create task list' });
            }
        } catch (error) {
            res.status(500).json({ error: 'Failed to create task list' });
        }
    }

    async delete(req: Request, res: Response): Promise<void> {
        try {
            const id = parseInt(req.params.id);
            await this.taskListsService.delete(id);
            res.status(204).send();
        } catch (error) {
            res.status(500).json({ error: 'Failed to delete task list' });
        }
    }
}

export default TaskListsController;