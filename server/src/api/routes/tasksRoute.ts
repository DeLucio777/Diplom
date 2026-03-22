import { Router, Request, Response } from 'express';
import TaskRepository from '../../repositories/TaskRepository';
import TaskItemsRepository from '../../repositories/TaskItemsRepository';
import Task from '../../entities/task';
import TaskConstruction from '../../entities/taskConstructor';
import FindOddOneOutItem from '../../entities/findOddOneOutItems';
import MatchImageWordPair from '../../entities/matchImageWordPairs';
import SequenceItem from '../../entities/sequenceItem';
import SortItem from '../../entities/sortItem';

const router = Router();
const taskRepo = new TaskRepository();
const taskItemsRepo = new TaskItemsRepository();

// GET /api/tasks - Get all tasks
router.get('/', async (req: Request, res: Response) => {
    try {
        const tasks = await taskRepo.getAll();
        res.json(tasks);
    } catch (error) {
        console.error('Error fetching tasks:', error);
        res.status(500).json({ error: 'Failed to fetch tasks' });
    }
});

// GET /api/tasks/:id - Get task by ID
router.get('/:id', async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id);
        const task = await taskRepo.getById(id);
        if (!task) {
            return res.status(404).json({ error: 'Task not found' });
        }
        res.json(task);
    } catch (error) {
        console.error('Error fetching task:', error);
        res.status(500).json({ error: 'Failed to fetch task' });
    }
});

// GET /api/tasks/:taskId/constructions - Get task constructions
router.get('/:taskId/constructions', async (req: Request, res: Response) => {
    try {
        const taskId = parseInt(req.params.taskId);
        const constructions = await taskItemsRepo.getConstructionsByTaskId(taskId);
        res.json(constructions);
    } catch (error) {
        console.error('Error fetching constructions:', error);
        res.status(500).json({ error: 'Failed to fetch constructions' });
    }
});

// GET /api/tasks/:taskId/find-odd-items - Get find odd items
router.get('/:taskId/find-odd-items', async (req: Request, res: Response) => {
    try {
        const taskId = parseInt(req.params.taskId);
        const items = await taskItemsRepo.getFindOddItemsByTaskId(taskId);
        res.json(items);
    } catch (error) {
        console.error('Error fetching find odd items:', error);
        res.status(500).json({ error: 'Failed to fetch find odd items' });
    }
});

// GET /api/tasks/:taskId/match-pairs - Get match pairs
router.get('/:taskId/match-pairs', async (req: Request, res: Response) => {
    try {
        const taskId = parseInt(req.params.taskId);
        const pairs = await taskItemsRepo.getMatchPairsByTaskId(taskId);
        res.json(pairs);
    } catch (error) {
        console.error('Error fetching match pairs:', error);
        res.status(500).json({ error: 'Failed to fetch match pairs' });
    }
});

// GET /api/tasks/:taskId/sequence-items - Get sequence items
router.get('/:taskId/sequence-items', async (req: Request, res: Response) => {
    try {
        const taskId = parseInt(req.params.taskId);
        const items = await taskItemsRepo.getSequenceItemsByTaskId(taskId);
        res.json(items);
    } catch (error) {
        console.error('Error fetching sequence items:', error);
        res.status(500).json({ error: 'Failed to fetch sequence items' });
    }
});

// GET /api/tasks/:taskId/sort-items - Get sort items
router.get('/:taskId/sort-items', async (req: Request, res: Response) => {
    try {
        const taskId = parseInt(req.params.taskId);
        const items = await taskItemsRepo.getSortItemsByTaskId(taskId);
        res.json(items);
    } catch (error) {
        console.error('Error fetching sort items:', error);
        res.status(500).json({ error: 'Failed to fetch sort items' });
    }
});

// POST /api/tasks - Create simple task
router.post('/', async (req: Request, res: Response) => {
    try {
        const taskData: Task = req.body;
        const taskId = await taskRepo.create(taskData);
        const task = await taskRepo.getById(taskId);
        res.status(201).json(task);
    } catch (error) {
        console.error('Error creating task:', error);
        res.status(500).json({ error: 'Failed to create task' });
    }
});

// POST /api/tasks/full - Create full task with all related data
router.post('/full', async (req: Request, res: Response) => {
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
        const taskId = await taskRepo.create(task);

        // Save constructions
        if (constructions && constructions.length > 0) {
            for (const c of constructions) {
                const construction: TaskConstruction = {
                    PK_ConstructionId: 0,
                    FK_TaskId: taskId,
                    ParameterName: c.ParameterName,
                    ParameterValue: c.ParameterValue
                };
                await taskItemsRepo.createConstruction(construction);
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
                await taskItemsRepo.createFindOddItem(oddItem);
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
                await taskItemsRepo.createMatchPair(matchPair);
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
                await taskItemsRepo.createSequenceItem(seqItem);
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
                await taskItemsRepo.createSortItem(sortItem);
            }
        }

        // Return the created task
        const createdTask = await taskRepo.getById(taskId);
        res.status(201).json(createdTask);
    } catch (error) {
        console.error('Error creating full task:', error);
        res.status(500).json({ error: 'Failed to create full task' });
    }
});

export default router;
