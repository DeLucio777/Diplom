import Task from "../../entities/task";
import TaskObjectService from "../../services/TaskObjectService";


export default class TaskController {
    private objectService: TaskObjectService;
    private static _instance: TaskController;

    private constructor() {
        this.objectService = new TaskObjectService();
        
        // Bind method to preserve 'this' context
        this.getAllTasks = this.getAllTasks.bind(this);
    }

    public static getInstance() {
        if (!this._instance) {
            this._instance = new TaskController();
        }
        return this._instance;
    }


    public async getAllTasks(): Promise<Task[]> {
        console.log("Getting all tasks");
        return await this.objectService.getAllTasks();
        
    }
}