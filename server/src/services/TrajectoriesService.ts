import TrajectoriesRepository from '../repositories/TrajectoriesRepository';
import LearningTrajectory from '../entities/learningTrajectory';
import TrajectoryStep from '../entities/trajectoryStep';

class TrajectoriesService {
    private trajectoriesRepo: TrajectoriesRepository;

    constructor() {
        this.trajectoriesRepo = new TrajectoriesRepository();
    }

    async getAll(): Promise<LearningTrajectory[]> {
        return await this.trajectoriesRepo.getAll();
    }

    async getSteps(id: number): Promise<TrajectoryStep[]> {
        return await this.trajectoriesRepo.getSteps(id);
    }

    async create(trajectory: LearningTrajectory): Promise<LearningTrajectory | null> {
        return await this.trajectoriesRepo.create(trajectory);
    }
}

export default TrajectoriesService;