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

    async getAllConstructions(req: Request, res: Response): Promise<void> {
        try {
            const constructions = await this.taskService.getAllConstructions();
            res.json(constructions);
        } catch (error) {
            console.error('Error fetching constructions:', error);
            res.status(500).json({ error: 'Failed to fetch constructions' });
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

    async getConstruction(req: Request, res: Response): Promise<void> {
        try {
            const id = parseInt(req.params.id);
            const construction = await this.taskService.getConstructionById(id);
            if (!construction) {
                res.status(404).json({ error: 'Task construction not found' });
                return;
            }
            res.json(construction);
        } catch (error) {
            console.error('Error fetching construction:', error);
            res.status(500).json({ error: 'Failed to fetch construction' });
        }
    }

    async createConstruction(req: Request, res: Response): Promise<void> {
        try {
            const construction: TaskConstruction = req.body;
            const id = await this.taskService.createConstruction(construction);
            const created = await this.taskService.getConstructionById(id);
            res.status(201).json(created);
        } catch (error) {
            console.error('Error creating construction:', error);
            res.status(500).json({ error: 'Failed to create construction' });
        }
    }

    async updateConstruction(req: Request, res: Response): Promise<void> {
        try {
            const id = parseInt(req.params.id);
            const construction: TaskConstruction = req.body;
            const updated = await this.taskService.updateConstruction(id, construction);
            if (!updated) {
                res.status(404).json({ error: 'Task construction not found' });
                return;
            }
            const updatedConstruction = await this.taskService.getConstructionById(id);
            res.json(updatedConstruction);
        } catch (error) {
            console.error('Error updating construction:', error);
            res.status(500).json({ error: 'Failed to update construction' });
        }
    }

    async deleteConstruction(req: Request, res: Response): Promise<void> {
        try {
            const id = parseInt(req.params.id);
            const deleted = await this.taskService.deleteConstruction(id);
            if (!deleted) {
                res.status(404).json({ error: 'Task construction not found' });
                return;
            }
            res.json({ success: true });
        } catch (error) {
            console.error('Error deleting construction:', error);
            res.status(500).json({ error: 'Failed to delete construction' });
        }
    }

    async getAllFindOddItems(req: Request, res: Response): Promise<void> {
        try {
            const items = await this.taskService.getAllFindOddItems();
            res.json(items);
        } catch (error) {
            console.error('Error fetching find odd items:', error);
            res.status(500).json({ error: 'Failed to fetch find odd items' });
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

    async getFindOddItem(req: Request, res: Response): Promise<void> {
        try {
            const id = parseInt(req.params.id);
            const item = await this.taskService.getFindOddItemById(id);
            if (!item) {
                res.status(404).json({ error: 'Find odd item not found' });
                return;
            }
            res.json(item);
        } catch (error) {
            console.error('Error fetching find odd item:', error);
            res.status(500).json({ error: 'Failed to fetch find odd item' });
        }
    }

    async createFindOddItem(req: Request, res: Response): Promise<void> {
        try {
            const item: FindOddOneOutItem = req.body;
            const id = await this.taskService.createFindOddItem(item);
            const created = await this.taskService.getFindOddItemById(id);
            res.status(201).json(created);
        } catch (error) {
            console.error('Error creating find odd item:', error);
            res.status(500).json({ error: 'Failed to create find odd item' });
        }
    }

    async updateFindOddItem(req: Request, res: Response): Promise<void> {
        try {
            const id = parseInt(req.params.id);
            const item: FindOddOneOutItem = req.body;
            const updated = await this.taskService.updateFindOddItem(id, item);
            if (!updated) {
                res.status(404).json({ error: 'Find odd item not found' });
                return;
            }
            const updatedItem = await this.taskService.getFindOddItemById(id);
            res.json(updatedItem);
        } catch (error) {
            console.error('Error updating find odd item:', error);
            res.status(500).json({ error: 'Failed to update find odd item' });
        }
    }

    async deleteFindOddItem(req: Request, res: Response): Promise<void> {
        try {
            const id = parseInt(req.params.id);
            const deleted = await this.taskService.deleteFindOddItem(id);
            if (!deleted) {
                res.status(404).json({ error: 'Find odd item not found' });
                return;
            }
            res.json({ success: true });
        } catch (error) {
            console.error('Error deleting find odd item:', error);
            res.status(500).json({ error: 'Failed to delete find odd item' });
        }
    }

    async getAllMatchPairs(req: Request, res: Response): Promise<void> {
        try {
            const pairs = await this.taskService.getAllMatchPairs();
            res.json(pairs);
        } catch (error) {
            console.error('Error fetching match pairs:', error);
            res.status(500).json({ error: 'Failed to fetch match pairs' });
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

    async getMatchPair(req: Request, res: Response): Promise<void> {
        try {
            const id = parseInt(req.params.id);
            const pair = await this.taskService.getMatchPairById(id);
            if (!pair) {
                res.status(404).json({ error: 'Match pair not found' });
                return;
            }
            res.json(pair);
        } catch (error) {
            console.error('Error fetching match pair:', error);
            res.status(500).json({ error: 'Failed to fetch match pair' });
        }
    }

    async createMatchPair(req: Request, res: Response): Promise<void> {
        try {
            const pair: MatchImageWordPair = req.body;
            const id = await this.taskService.createMatchPair(pair);
            const created = await this.taskService.getMatchPairById(id);
            res.status(201).json(created);
        } catch (error) {
            console.error('Error creating match pair:', error);
            res.status(500).json({ error: 'Failed to create match pair' });
        }
    }

    async updateMatchPair(req: Request, res: Response): Promise<void> {
        try {
            const id = parseInt(req.params.id);
            const pair: MatchImageWordPair = req.body;
            const updated = await this.taskService.updateMatchPair(id, pair);
            if (!updated) {
                res.status(404).json({ error: 'Match pair not found' });
                return;
            }
            const updatedPair = await this.taskService.getMatchPairById(id);
            res.json(updatedPair);
        } catch (error) {
            console.error('Error updating match pair:', error);
            res.status(500).json({ error: 'Failed to update match pair' });
        }
    }

    async deleteMatchPair(req: Request, res: Response): Promise<void> {
        try {
            const id = parseInt(req.params.id);
            const deleted = await this.taskService.deleteMatchPair(id);
            if (!deleted) {
                res.status(404).json({ error: 'Match pair not found' });
                return;
            }
            res.json({ success: true });
        } catch (error) {
            console.error('Error deleting match pair:', error);
            res.status(500).json({ error: 'Failed to delete match pair' });
        }
    }

    async getAllSequenceItems(req: Request, res: Response): Promise<void> {
        try {
            const items = await this.taskService.getAllSequenceItems();
            res.json(items);
        } catch (error) {
            console.error('Error fetching sequence items:', error);
            res.status(500).json({ error: 'Failed to fetch sequence items' });
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

    async getSequenceItem(req: Request, res: Response): Promise<void> {
        try {
            const id = parseInt(req.params.id);
            const item = await this.taskService.getSequenceItemById(id);
            if (!item) {
                res.status(404).json({ error: 'Sequence item not found' });
                return;
            }
            res.json(item);
        } catch (error) {
            console.error('Error fetching sequence item:', error);
            res.status(500).json({ error: 'Failed to fetch sequence item' });
        }
    }

    async createSequenceItem(req: Request, res: Response): Promise<void> {
        try {
            const item: SequenceItem = req.body;
            const id = await this.taskService.createSequenceItem(item);
            const created = await this.taskService.getSequenceItemById(id);
            res.status(201).json(created);
        } catch (error) {
            console.error('Error creating sequence item:', error);
            res.status(500).json({ error: 'Failed to create sequence item' });
        }
    }

    async updateSequenceItem(req: Request, res: Response): Promise<void> {
        try {
            const id = parseInt(req.params.id);
            const item: SequenceItem = req.body;
            const updated = await this.taskService.updateSequenceItem(id, item);
            if (!updated) {
                res.status(404).json({ error: 'Sequence item not found' });
                return;
            }
            const updatedItem = await this.taskService.getSequenceItemById(id);
            res.json(updatedItem);
        } catch (error) {
            console.error('Error updating sequence item:', error);
            res.status(500).json({ error: 'Failed to update sequence item' });
        }
    }

    async deleteSequenceItem(req: Request, res: Response): Promise<void> {
        try {
            const id = parseInt(req.params.id);
            const deleted = await this.taskService.deleteSequenceItem(id);
            if (!deleted) {
                res.status(404).json({ error: 'Sequence item not found' });
                return;
            }
            res.json({ success: true });
        } catch (error) {
            console.error('Error deleting sequence item:', error);
            res.status(500).json({ error: 'Failed to delete sequence item' });
        }
    }

    async getAllSortItems(req: Request, res: Response): Promise<void> {
        try {
            const items = await this.taskService.getAllSortItems();
            res.json(items);
        } catch (error) {
            console.error('Error fetching sort items:', error);
            res.status(500).json({ error: 'Failed to fetch sort items' });
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

    async getSortItem(req: Request, res: Response): Promise<void> {
        try {
            const id = parseInt(req.params.id);
            const item = await this.taskService.getSortItemById(id);
            if (!item) {
                res.status(404).json({ error: 'Sort item not found' });
                return;
            }
            res.json(item);
        } catch (error) {
            console.error('Error fetching sort item:', error);
            res.status(500).json({ error: 'Failed to fetch sort item' });
        }
    }

    async createSortItem(req: Request, res: Response): Promise<void> {
        try {
            const item: SortItem = req.body;
            const id = await this.taskService.createSortItem(item);
            const created = await this.taskService.getSortItemById(id);
            res.status(201).json(created);
        } catch (error) {
            console.error('Error creating sort item:', error);
            res.status(500).json({ error: 'Failed to create sort item' });
        }
    }

    async updateSortItem(req: Request, res: Response): Promise<void> {
        try {
            const id = parseInt(req.params.id);
            const item: SortItem = req.body;
            const updated = await this.taskService.updateSortItem(id, item);
            if (!updated) {
                res.status(404).json({ error: 'Sort item not found' });
                return;
            }
            const updatedItem = await this.taskService.getSortItemById(id);
            res.json(updatedItem);
        } catch (error) {
            console.error('Error updating sort item:', error);
            res.status(500).json({ error: 'Failed to update sort item' });
        }
    }

    async deleteSortItem(req: Request, res: Response): Promise<void> {
        try {
            const id = parseInt(req.params.id);
            const deleted = await this.taskService.deleteSortItem(id);
            if (!deleted) {
                res.status(404).json({ error: 'Sort item not found' });
                return;
            }
            res.json({ success: true });
        } catch (error) {
            console.error('Error deleting sort item:', error);
            res.status(500).json({ error: 'Failed to delete sort item' });
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

    async publish(req: Request, res: Response): Promise<void> {
        try {
            const taskId = parseInt(req.params.taskId);
            const published = req.body.public_task ?? req.body.published;
            const success = await this.taskService.publish(taskId, Boolean(published));
            if (!success) {
                res.status(404).json({ error: 'Task not found' });
                return;
            }
            res.json({ success: true });
        } catch (error) {
            console.error('Error publishing task:', error);
            res.status(500).json({ error: 'Failed to publish task' });
        }
    }

    async updateFull(req: Request, res: Response): Promise<void> {
        try {
            const taskId = parseInt(req.params.taskId);
            const { 
                task, 
                constructions, 
                findOddItems, 
                matchPairs, 
                sequenceItems, 
                sortItems 
            } = req.body;

            const updated = await this.taskService.updateFull(taskId, {
                task,
                constructions,
                findOddItems,
                matchPairs,
                sequenceItems,
                sortItems
            });

            if (!updated) {
                res.status(404).json({ error: 'Task not found' });
                return;
            }

            const updatedTask = await this.taskService.getById(taskId);
            res.json(updatedTask);
        } catch (error) {
            console.error('Error updating full task:', error);
            res.status(500).json({ error: 'Failed to update full task' });
        }
    }
}

export default TaskController;
