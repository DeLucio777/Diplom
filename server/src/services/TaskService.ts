import TaskRepository from '../repositories/TaskRepository';
import TaskItemsRepository from '../repositories/TaskItemsRepository';
import Task from '../entities/task';
import TaskConstruction from '../entities/taskConstructor';
import FindOddOneOutItem from '../entities/findOddOneOutItems';
import MatchImageWordPair from '../entities/matchImageWordPairs';
import SequenceItem from '../entities/sequenceItem';
import SortItem from '../entities/sortItem';

class TaskService {
    private taskRepo: TaskRepository;
    private taskItemsRepo: TaskItemsRepository;

    constructor() {
        this.taskRepo = new TaskRepository();
        this.taskItemsRepo = new TaskItemsRepository();
    }

    async getAll(): Promise<Task[]> {
        return await this.taskRepo.getAll();
    }

    async getById(id: number): Promise<Task | null> {
        return await this.taskRepo.getById(id);
    }

    async getAllConstructions(): Promise<TaskConstruction[]> {
        return await this.taskItemsRepo.getAllConstructions();
    }

    async getConstructionById(id: number): Promise<TaskConstruction | null> {
        return await this.taskItemsRepo.getConstructionById(id);
    }

    async getConstructionsByTaskId(taskId: number): Promise<TaskConstruction[]> {
        return await this.taskItemsRepo.getConstructionsByTaskId(taskId);
    }

    async createConstruction(construction: TaskConstruction): Promise<number> {
        return await this.taskItemsRepo.createConstruction(construction);
    }

    async updateConstruction(id: number, construction: TaskConstruction): Promise<boolean> {
        return await this.taskItemsRepo.updateConstruction(id, construction);
    }

    async deleteConstruction(id: number): Promise<boolean> {
        return await this.taskItemsRepo.deleteConstruction(id);
    }

    async getAllFindOddItems(): Promise<FindOddOneOutItem[]> {
        return await this.taskItemsRepo.getAllFindOddItems();
    }

    async getFindOddItemById(id: number): Promise<FindOddOneOutItem | null> {
        return await this.taskItemsRepo.getFindOddItemById(id);
    }

    async getFindOddItemsByTaskId(taskId: number): Promise<FindOddOneOutItem[]> {
        return await this.taskItemsRepo.getFindOddItemsByTaskId(taskId);
    }

    async createFindOddItem(item: FindOddOneOutItem): Promise<number> {
        return await this.taskItemsRepo.createFindOddItem(item);
    }

    async updateFindOddItem(id: number, item: FindOddOneOutItem): Promise<boolean> {
        return await this.taskItemsRepo.updateFindOddItem(id, item);
    }

    async deleteFindOddItem(id: number): Promise<boolean> {
        return await this.taskItemsRepo.deleteFindOddItem(id);
    }

    async getAllMatchPairs(): Promise<MatchImageWordPair[]> {
        return await this.taskItemsRepo.getAllMatchPairs();
    }

    async getMatchPairById(id: number): Promise<MatchImageWordPair | null> {
        return await this.taskItemsRepo.getMatchPairById(id);
    }

    async getMatchPairsByTaskId(taskId: number): Promise<MatchImageWordPair[]> {
        return await this.taskItemsRepo.getMatchPairsByTaskId(taskId);
    }

    async createMatchPair(pair: MatchImageWordPair): Promise<number> {
        return await this.taskItemsRepo.createMatchPair(pair);
    }

    async updateMatchPair(id: number, pair: MatchImageWordPair): Promise<boolean> {
        return await this.taskItemsRepo.updateMatchPair(id, pair);
    }

    async deleteMatchPair(id: number): Promise<boolean> {
        return await this.taskItemsRepo.deleteMatchPair(id);
    }

    async getAllSequenceItems(): Promise<SequenceItem[]> {
        return await this.taskItemsRepo.getAllSequenceItems();
    }

    async getSequenceItemById(id: number): Promise<SequenceItem | null> {
        return await this.taskItemsRepo.getSequenceItemById(id);
    }

    async getSequenceItemsByTaskId(taskId: number): Promise<SequenceItem[]> {
        return await this.taskItemsRepo.getSequenceItemsByTaskId(taskId);
    }

    async createSequenceItem(item: SequenceItem): Promise<number> {
        return await this.taskItemsRepo.createSequenceItem(item);
    }

    async updateSequenceItem(id: number, item: SequenceItem): Promise<boolean> {
        return await this.taskItemsRepo.updateSequenceItem(id, item);
    }

    async deleteSequenceItem(id: number): Promise<boolean> {
        return await this.taskItemsRepo.deleteSequenceItem(id);
    }

    async getAllSortItems(): Promise<SortItem[]> {
        return await this.taskItemsRepo.getAllSortItems();
    }

    async getSortItemById(id: number): Promise<SortItem | null> {
        return await this.taskItemsRepo.getSortItemById(id);
    }

    async getSortItemsByTaskId(taskId: number): Promise<SortItem[]> {
        return await this.taskItemsRepo.getSortItemsByTaskId(taskId);
    }

    async createSortItem(item: SortItem): Promise<number> {
        return await this.taskItemsRepo.createSortItem(item);
    }

    async updateSortItem(id: number, item: SortItem): Promise<boolean> {
        return await this.taskItemsRepo.updateSortItem(id, item);
    }

    async deleteSortItem(id: number): Promise<boolean> {
        return await this.taskItemsRepo.deleteSortItem(id);
    }

    async create(taskData: Task): Promise<number> {
        return await this.taskRepo.create(taskData);
    }

    async createFull(data: {
        task: Task;
        constructions?: TaskConstruction[];
        findOddItems?: FindOddOneOutItem[];
        matchPairs?: MatchImageWordPair[];
        sequenceItems?: SequenceItem[];
        sortItems?: SortItem[];
    }): Promise<number> {
        const { 
            task, 
            constructions, 
            findOddItems, 
            matchPairs, 
            sequenceItems, 
            sortItems 
        } = data;

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

        return taskId;
    }

    async delete(id: number): Promise<boolean> {
        await this.taskItemsRepo.deleteConstructionsByTaskId(id);
        await this.taskItemsRepo.deleteFindOddItemsByTaskId(id);
        await this.taskItemsRepo.deleteMatchPairsByTaskId(id);
        await this.taskItemsRepo.deleteSequenceItemsByTaskId(id);
        await this.taskItemsRepo.deleteSortItemsByTaskId(id);
        
        return await this.taskRepo.delete(id);
    }

    async publish(taskId: number, published: boolean): Promise<boolean> {
        return await this.taskRepo.publish(taskId, published);
    }

    async updateFull(taskId: number, data: {
        task: Task;
        constructions?: TaskConstruction[];
        findOddItems?: FindOddOneOutItem[];
        matchPairs?: MatchImageWordPair[];
        sequenceItems?: SequenceItem[];
        sortItems?: SortItem[];
    }): Promise<boolean> {
        const { 
            task, 
            constructions, 
            findOddItems, 
            matchPairs, 
            sequenceItems, 
            sortItems 
        } = data;

        // Delete existing items
        await this.taskItemsRepo.deleteConstructionsByTaskId(taskId);
        await this.taskItemsRepo.deleteFindOddItemsByTaskId(taskId);
        await this.taskItemsRepo.deleteMatchPairsByTaskId(taskId);
        await this.taskItemsRepo.deleteSequenceItemsByTaskId(taskId);
        await this.taskItemsRepo.deleteSortItemsByTaskId(taskId);

        // Update task
        await this.taskRepo.update(taskId, task);

        // Save new constructions
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

        // Save new find odd items
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

        // Save new match pairs
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

        // Save new sequence items
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

        // Save new sort items
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

        return true;
    }
}

export default TaskService;
