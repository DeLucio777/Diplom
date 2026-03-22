import PECSRepository from '../repositories/PECSRepository';
import CatalogPECS from '../entities/catalogPECS';

class PecsService {
    private pecsRepo: PECSRepository;

    constructor() {
        this.pecsRepo = new PECSRepository();
    }

    async getAll(): Promise<CatalogPECS[]> {
        return await this.pecsRepo.getAll();
    }

    async getById(id: number): Promise<CatalogPECS | null> {
        return await this.pecsRepo.getById(id);
    }
}

export default PecsService;
