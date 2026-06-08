import EducatorsRepository from '../repositories/EducatorsRepository';
import Educator from '../entities/educator';

class EducatorsService {
    private educatorsRepo: EducatorsRepository;

    constructor() {
        this.educatorsRepo = new EducatorsRepository();
    }

    async getAll(): Promise<Educator[]> {
        return await this.educatorsRepo.getAll();
    }

    async getById(id: number): Promise<Educator | null> {
        return await this.educatorsRepo.getById(id);
    }

    async getByUserId(userId: number): Promise<Educator | null> {
        return await this.educatorsRepo.getByUserId(userId);
    }

    async create(educator: Educator): Promise<Educator | null> {
        return await this.educatorsRepo.create(educator);
    }

    async update(id: number, educator: Educator): Promise<boolean> {
        return await this.educatorsRepo.update(id, educator);
    }

    async delete(id: number): Promise<boolean> {
        return await this.educatorsRepo.delete(id);
    }
}

export default EducatorsService;