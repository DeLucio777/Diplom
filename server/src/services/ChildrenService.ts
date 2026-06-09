import ChildrenRepository from '../repositories/ChildrenRepository';
import Child from '../entities/child';

class ChildrenService {
    private childrenRepo: ChildrenRepository;

    constructor() {
        this.childrenRepo = new ChildrenRepository();
    }

    async getAll(): Promise<Child[]> {
        return await this.childrenRepo.getAll();
    }

    async getById(id: number): Promise<Child | null> {
        return await this.childrenRepo.getById(id);
    }

    async getByEducator(educatorId: number): Promise<Child[]> {
        return await this.childrenRepo.getByEducator(educatorId);
    }

    async getByRepresentative(repId: number): Promise<Child[]> {
        return await this.childrenRepo.getByRepresentative(repId);
    }

    async create(child: Child): Promise<Child | null> {
        return await this.childrenRepo.create(child);
    }

    async update(id: number, child: Child): Promise<boolean> {
        return await this.childrenRepo.update(id, child);
    }

    async delete(id: number): Promise<boolean> {
        return await this.childrenRepo.delete(id);
    }
}

export default ChildrenService;