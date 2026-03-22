import { Request, Response } from 'express';
import TaskRepository from '../../repositories/TaskRepository';
import TaskItemsRepository from '../../repositories/TaskItemsRepository';
import Task from '../../entities/task';
import TaskConstruction from '../../entities/taskConstructor';
import FindOddOneOutItem from '../../entities/findOddOneOutItems';
import MatchImageWordPair from '../../entities/matchImageWordPairs';
import SequenceItem from '../../entities/sequenceItem';
import SortItem from '../../entities/sortItem';

class TaskController {
    private taskRepo: TaskRepository;
    private taskItemsRepo: TaskItemsRepository;

    constructor() {
        this.taskRepo = new TaskRepository();
        this.taskItemsRepo = new TaskItemsRepository();
    }

    async getAll(req: Request, res: Response): Promise<void> {
        try {
            const tasks = await this.taskRepo.getAll();
            res.json(tasks);
        } catch (error) {
            console.error('Error fetching tasks:', error);
            res.status(500).json({ error: 'Failed to fetch tasks' });
        }
    }

    async getById(req: Request, res: Response): Promise<void> {
        try {
            const id = parseInt(req.params.id);
            const task = await this.taskRepo.getById(id);
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
            const constructions = await this.taskItemsRepo.getConstructionsByTaskId(taskId);
            res.json(constructions);
        } catch (error) {
            console.error('Error fetching constructions:', error);
            res.status(500).json({ error: 'Failed to fetch constructions' });
        }
    }

    async getFindOddItems(req: Request, res: Response): Promise<void> {
        try {
            const taskId = parseInt(req.params.taskId);
            const items = await this.taskItemsRepo.getFindOddItemsByTaskId(taskId);
            res.json(items);
        } catch (error) {
            console.error('Error fetching find odd items:', error);
            res.status(500).json({ error: 'Failed to fetch find odd items' });
        }
    }

    async getMatchPairs(req: Request, res: Response): Promise<void> {
        try {
            const taskId = parseInt(req.params.taskId);
            const pairs = await this.taskItemsRepo.getMatchPairsByTaskId(taskId);
            res.json(pairs);
        } catch (error) {
            console.error('Error fetching match pairs:', error);
            res.status(500).json({ error: 'Failed to fetch match pairs' });
        }
    }

    async getSequenceItems(req: Request, res: Response): Promise<void> {
        try {
            const taskId = parseInt(req.params.taskId);
            const items = await this.taskItemsRepo.getSequenceItemsByTaskId(taskId);
            res.json(items);
        } catch (error) {
            console.error('Error fetching sequence items:', error);
            res.status(500).json({ error: 'Failed to fetch sequence items' });
        }
    }

    async getSortItems(req: Request, res: Response): Promise<void> {
        try {
            const taskId = parseInt(req.params.taskId);
            const items = await this.taskItemsRepo.getSortItemsByTaskId(taskId);
            res.json(items);
        } catch (error) {
            console.error('Error fetching sort items:', error);
            res.status(500).json({ error: 'Failed to fetch sort items' });
        }
    }

    async create(req: Request, res: Response): Promise<void> {
        try {
            const taskData: Task = req.body;
            const taskId = await this.taskRepo.create(taskData);
            const task = await this.taskRepo.getById(taskId);
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

            // Create the task first
            const taskId = await this.taskRepo.create(task);

            // Save constructions
            if (constructions && constructions.length > 0) {
                for (const c of constructions) {
                    const construction: TaskConstruction = {
                        PK_ConstructionId: 0,
                        FK_TaskId: taskId,
                        ParameterName: c.ParameterName,
                        ParameterValue: c.ParameterValue
                    };
                    await this.taskItemsRepo.createConstruction(construction);
                }
            }

            // Save find odd items
            if (findOddItems && findOddItems.length > 0) {
                for (const item of findOddItems) {
                    const oddItem: FindOddOneOutItem = {
                        PK_ItemId: 0,
                        FK_TaskId: taskId,
                        ItemText: item.ItemText,
                        IsOddOne: item.IsOddOne,
                        FK_pecsId: item.FK_pecsId
                    };
                    await this.taskItemsRepo.createFindOddItem(oddItem);
                }
            }

            // Save match pairs
            if (matchPairs && matchPairs.length > 0) {
                for (const pair of matchPairs) {
                    const matchPair: MatchImageWordPair = {
                        PK_PairId: 0,
                        FK_TaskId: taskId,
                        FK_MediaId: pair.FK_MediaId || 0,
                        FK_pecsId: pair.FK_pecsId,
                        Words: pair.Words
                    };
                    await this.taskItemsRepo.createMatchPair(matchPair);
                }
            }

            // Save sequence items
            if (sequenceItems && sequenceItems.length > 0) {
                for (const item of sequenceItems) {
                    const seqItem: SequenceItem = {
                        PK_SeqItemId: 0,
                        FK_TaskId: taskId,
                        ItemOrder: item.ItemOrder,
                        ItemValue: item.ItemValue,
                        FK_pecsId: item.FK_pecsId
                    };
                    await this.taskItemsRepo.createSequenceItem(seqItem);
                }
            }

            // Save sort items
            if (sortItems && sortItems.length > 0) {
                for (const item of sortItems) {
                    const sortItem: SortItem = {
                        PK_SortItemId: 0,
                        FK_TaskId: taskId,
                        ItemValue: item.ItemValue,
                        SortKey: item.SortKey,
                        FK_pecsId: item.FK_pecsId
                    };
                    await this.taskItemsRepo.createSortItem(sortItem);
                }
            }

            // Return the created task
            const createdTask = await this.taskRepo.getById(taskId);
            res.status(201).json(createdTask);
        } catch (error) {
            console.error('Error creating full task:', error);
            res.status(500).json({ error: 'Failed to create full task' });
        }
    }
}

export default TaskController;
