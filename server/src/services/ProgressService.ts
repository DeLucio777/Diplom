import ProgressRepository from '../repositories/ProgressRepository';
import ProgressRecord from '../entities/progressRecord';

class ProgressService {
    private progressRepo: ProgressRepository;

    constructor() {
        this.progressRepo = new ProgressRepository();
    }

    async getAll(): Promise<ProgressRecord[]> {
        return await this.progressRepo.getAll();
    }

    async getByChild(childId: number): Promise<ProgressRecord[]> {
        return await this.progressRepo.getByChild(childId);
    }

    async create(progress: ProgressRecord): Promise<ProgressRecord | null> {
        return await this.progressRepo.create(progress);
    }
}

export default ProgressService;