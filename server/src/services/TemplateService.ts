import TaskTemplateRepository from '../repositories/TaskTemplateRepository';
import TaskTemplate from '../entities/taskTemplate';

class TemplateService {
    private templateRepo: TaskTemplateRepository;

    constructor() {
        this.templateRepo = new TaskTemplateRepository();
    }

    async getAll(): Promise<TaskTemplate[]> {
        return await this.templateRepo.getAll();
    }

    async getById(id: number): Promise<TaskTemplate | null> {
        return await this.templateRepo.getById(id);
    }
}

export default TemplateService;
