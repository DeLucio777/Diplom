import { Request, Response } from 'express';
import TaskService from '../../services/TaskService';
import Task from '../../entities/task';
import TaskConstruction from '../../entities/taskConstructor';
import FindOddOneOutItem from '../../entities/findOddOneOutItems';
import MatchImageWordPair from '../../entities/matchImageWordPairs';
import SequenceItem from '../../entities/sequenceItem';
import SortItem from '../../entities/sortItem';

class TaskController {
    private taskService: TaskService;

    constructor() {
        this.taskService = new TaskService();
    }

    async getAll(req: Request, res: Response): Promise<void> {
        try {
            const tasks = await this.taskService.getAll();
            res.json(tasks);
        } catch (error) {
            console.error('Error fetching tasks:', error);
            res.status(500).json({ error: 'Failed to fetch tasks' });
        }
    }

    async getById(req: Request, res: Response): Promise<void> {
        try {
            const id = parseInt(req.params.id);
            const task = await this.taskService.getById(id);
            if (!task) {
                res.status(404).json({ error: 'Task not found' });
                return;
            }
            res.json(task);
        } catch (error) {
            console.error('Error fetching task:', error);
            res.status(500).json({ error: 'Failed to fetch task' });
        }
    }

    async getConstructions(req: Request, res: Response): Promise<void> {
        try {
            const taskId = parseInt(req.params.taskId);
            const constructions = await this.taskService.getConstructionsByTaskId(taskId);
            res.json(constructions);
        } catch (error) {
            console.error('Error fetching constructions:', error);
            res.status(500).json({ error: 'Failed to fetch constructions' });
        }
    }

    async getFindOddItems(req: Request, res: Response): Promise<void> {
        try {
            const taskId = parseInt(req.params.taskId);
            const items = await this.taskService.getFindOddItemsByTaskId(taskId);
            res.json(items);
        } catch (error) {
            console.error('Error fetching find odd items:', error);
            res.status(500).json({ error: 'Failed to fetch find odd items' });
        }
    }

    async getMatchPairs(req: Request, res: Response): Promise<void> {
        try {
            const taskId = parseInt(req.params.taskId);
            const pairs = await this.taskService.getMatchPairsByTaskId(taskId);
            res.json(pairs);
        } catch (error) {
            console.error('Error fetching match pairs:', error);
            res.status(500).json({ error: 'Failed to fetch match pairs' });
        }
    }

    async getSequenceItems(req: Request, res: Response): Promise<void> {
        try {
            const taskId = parseInt(req.params.taskId);
            const items = await this.taskService.getSequenceItemsByTaskId(taskId);
            res.json(items);
        } catch (error) {
            console.error('Error fetching sequence items:', error);
            res.status(500).json({ error: 'Failed to fetch sequence items' });
        }
    }

    async getSortItems(req: Request, res: Response): Promise<void> {
        try {
            const taskId = parseInt(req.params.taskId);
            const items = await this.taskService.getSortItemsByTaskId(taskId);
            res.json(items);
        } catch (error) {
            console.error('Error fetching sort items:', error);
            res.status(500).json({ error: 'Failed to fetch sort items' });
        }
    }

    async create(req: Request, res: Response): Promise<void> {
        try {
            const taskData: Task = req.body;
            const taskId = await this.taskService.create(taskData);
            const task = await this.taskService.getById(taskId);
            res.status(201).json(task);
        } catch (error) {
            console.error('Error creating task:', error);
            res.status(500).json({ error: 'Failed to create task' });
        }
    }

    async createFull(req: Request, res: Response): Promise<void> {
        try {
            const { 
                task, 
                constructions, 
                findOddItems, 
                matchPairs, 
                sequenceItems, 
                sortItems 
            } = req.body;

            const taskId = await this.taskService.createFull({
                task,
                constructions,
                findOddItems,
                matchPairs,
                sequenceItems,
                sortItems
            });

            const createdTask = await this.taskService.getById(taskId);
            res.status(201).json(createdTask);
        } catch (error) {
            console.error('Error creating full task:', error);
            res.status(500).json({ error: 'Failed to create full task' });
        }
    }

    async delete(req: Request, res: Response): Promise<void> {
        try {
            const id = parseInt(req.params.id);
            const deleted = await this.taskService.delete(id);
            if (!deleted) {
                res.status(404).json({ error: 'Task not found' });
                return;
            }
            res.json({ success: true });
        } catch (error) {
            console.error('Error deleting task:', error);
            res.status(500).json({ error: 'Failed to delete task' });
        }
    }
}

export default TaskController;
