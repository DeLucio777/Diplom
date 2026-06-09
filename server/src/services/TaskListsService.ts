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

    async create(taskList: TaskList): Promise<TaskList | null> {
        return await this.taskListsRepo.create(taskList);
    }

    async delete(id: number): Promise<void> {
        return await this.taskListsRepo.delete(id);
    }
}

export default TaskListsService;