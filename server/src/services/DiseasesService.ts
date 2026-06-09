import DiseasesRepository from '../repositories/DiseasesRepository';
import Disease from '../entities/disease';

class DiseasesService {
    private diseasesRepo: DiseasesRepository;

    constructor() {
        this.diseasesRepo = new DiseasesRepository();
    }

    async getAll(): Promise<Disease[]> {
        return await this.diseasesRepo.getAll();
    }
}

export default DiseasesService;