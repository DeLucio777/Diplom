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
            const taskList = await this.taskListsService.create(req.body);
            if (taskList) {
                res.status(201).json(taskList);
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