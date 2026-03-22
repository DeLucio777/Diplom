import Task from "../entities/task";
import TaskRepository from "../repositories/TaskRepository";


export default class TaskObjectService {
    private tasksRepository: TaskRepository;
    constructor() {
        this.tasksRepository = new TaskRepository();
    }
    public async getAllTasks(): Promise<Task[]> {
        return await this.tasksRepository.getAll();
    }



}