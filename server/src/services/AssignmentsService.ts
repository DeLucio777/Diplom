import AssignmentsRepository from '../repositories/AssignmentsRepository';
import TaskAssignment from '../entities/taskAssignment';

class AssignmentsService {
    private assignmentsRepo: AssignmentsRepository;

    constructor() {
        this.assignmentsRepo = new AssignmentsRepository();
    }

    async getAll(): Promise<TaskAssignment[]> {
        return await this.assignmentsRepo.getAll();
    }

    async getByChild(childId: number): Promise<TaskAssignment[]> {
        return await this.assignmentsRepo.getByChild(childId);
    }

    async create(assignment: TaskAssignment): Promise<TaskAssignment | null> {
        return await this.assignmentsRepo.create(assignment);
    }

    async updateStatus(id: number, status: string): Promise<boolean> {
        return await this.assignmentsRepo.updateStatus(id, status);
    }
}

export default AssignmentsService;