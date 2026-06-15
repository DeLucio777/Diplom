import { Request, Response } from 'express';
import TaskListsService from '../../services/TaskListsService';

class TaskListItemsController {
    private taskListsService: TaskListsService;

    constructor() {
        this.taskListsService = new TaskListsService();
    }

    async getAll(req: Request, res: Response): Promise<void> {
        try {
            const items = await this.taskListsService.getAllItems();
            res.json(items);
        } catch (error) {
            console.error('Error fetching task list items:', error);
            res.status(500).json({ error: 'Failed to fetch task list items' });
        }
    }

    async getById(req: Request, res: Response): Promise<void> {
        try {
            const id = parseInt(req.params.id);
            const item = await this.taskListsService.getItemById(id);
            if (!item) {
                res.status(404).json({ error: 'Task list item not found' });
                return;
            }
            res.json(item);
        } catch (error) {
            console.error('Error fetching task list item:', error);
            res.status(500).json({ error: 'Failed to fetch task list item' });
        }
    }

    async completeItem(req: Request, res: Response): Promise<void> {
        try {
            const id = parseInt(req.params.id);
            const completed = req.body.completed ?? req.body.complited ?? true;
            const item = await this.taskListsService.completeItem(id, Boolean(completed));
            if (!item) {
                res.status(404).json({ error: 'Task list item not found' });
                return;
            }
            res.json(item);
        } catch (error) {
            console.error('Error completing task list item:', error);
            res.status(500).json({ error: 'Failed to complete task list item' });
        }
    }

    async completeForUser(req: Request, res: Response): Promise<void> {
        try {
            const taskListId = parseInt(req.body.taskListId);
            const userId = parseInt(req.body.userId);
            const completed = req.body.completed ?? req.body.complited ?? true;
            const updatedCount = await this.taskListsService.completeItemsForUser(taskListId, userId, Boolean(completed));
            res.json({ success: true, updatedCount });
        } catch (error) {
            console.error('Error completing task list items for user:', error);
            res.status(500).json({ error: 'Failed to complete task list items for user' });
        }
    }
}

export default TaskListItemsController;
