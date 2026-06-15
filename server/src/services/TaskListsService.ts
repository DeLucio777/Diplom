import TaskListsRepository from '../repositories/TaskListsRepository';
import TaskList from '../entities/taskList';
import TaskListItem from '../entities/taskListItem';

class TaskListsService {
    private taskListsRepo: TaskListsRepository;

    constructor() {
        this.taskListsRepo = new TaskListsRepository();
    }

    async getAll(): Promise<TaskList[]> {
        return await this.taskListsRepo.getAll();
    }

    async getByTeacher(teacherId: number): Promise<TaskList[]> {
        return await this.taskListsRepo.getByTeacher(teacherId);
    }

    async getByUser(userId: number): Promise<TaskList[]> {
        return await this.taskListsRepo.getByUser(userId);
    }

    async getItems(taskListId: number): Promise<TaskListItem[]> {
        return await this.taskListsRepo.getItems(taskListId);
    }

    async getAllItems(): Promise<TaskListItem[]> {
        return await this.taskListsRepo.getAllItems();
    }

    async getItemById(id: number): Promise<TaskListItem | null> {
        return await this.taskListsRepo.getItemById(id);
    }

    async completeItem(itemId: number, completed: boolean): Promise<TaskListItem | null> {
        return await this.taskListsRepo.updateItemCompletion(itemId, completed);
    }

    async completeItemsForUser(taskListId: number, userId: number, completed: boolean): Promise<number> {
        return await this.taskListsRepo.updateItemsForUser(taskListId, userId, completed);
    }

    async create(taskList: TaskList, taskIds: number[] = [], userIds: number[] = []): Promise<TaskList | null> {
        return await this.taskListsRepo.create(taskList, taskIds, userIds);
    }

    async delete(id: number): Promise<boolean> {
        return await this.taskListsRepo.delete(id);
    }
}

export default TaskListsService;