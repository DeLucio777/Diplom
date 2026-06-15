import ProgressRepository from '../repositories/ProgressRepository';
import ProgressRecord from '../entities/progressRecord';

class ProgressService {
    private progressRepo: ProgressRepository;

    constructor() {
        this.progressRepo = new ProgressRepository();
    }

    async getAll(userId?: number): Promise<ProgressRecord[]> {
        return await this.progressRepo.getAll(userId);
    }
}

export default ProgressService;
