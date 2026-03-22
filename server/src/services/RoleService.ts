import RoleRepository from '../repositories/RoleRepository';
import Role from '../entities/role';

class RoleService {
    private roleRepo: RoleRepository;

    constructor() {
        this.roleRepo = new RoleRepository();
    }

    async getAll(): Promise<Role[]> {
        return await this.roleRepo.getAll();
    }

    async getById(id: number): Promise<Role | null> {
        return await this.roleRepo.getById(id);
    }
}

export default RoleService;
