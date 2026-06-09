import RepresentativesRepository from '../repositories/RepresentativesRepository';
import LegalRepresentative from '../entities/legalRepresentative';

class RepresentativesService {
    private representativesRepo: RepresentativesRepository;

    constructor() {
        this.representativesRepo = new RepresentativesRepository();
    }

    async getAll(): Promise<LegalRepresentative[]> {
        return await this.representativesRepo.getAll();
    }

    async getByUserId(userId: number): Promise<LegalRepresentative | null> {
        return await this.representativesRepo.getByUserId(userId);
    }

    async create(rep: LegalRepresentative): Promise<LegalRepresentative | null> {
        return await this.representativesRepo.create(rep);
    }

    async delete(id: number): Promise<boolean> {
        return await this.representativesRepo.delete(id);
    }
}

export default RepresentativesService;