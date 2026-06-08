import SensoryProfileRepository from '../repositories/SensoryProfileRepository';
import SensoryProfile from '../entities/sensoryProfile';

class SensoryProfileService {
    private sensoryProfileRepo: SensoryProfileRepository;

    constructor() {
        this.sensoryProfileRepo = new SensoryProfileRepository();
    }

    async getByChild(childId: number): Promise<SensoryProfile | null> {
        return await this.sensoryProfileRepo.getByChild(childId);
    }

    async save(childId: number, data: Partial<SensoryProfile>): Promise<SensoryProfile | null> {
        return await this.sensoryProfileRepo.save(childId, data);
    }
}

export default SensoryProfileService;