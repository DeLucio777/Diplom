import UserRepository from '../repositories/UserRepository';
import User from '../entities/user';

class UserService {
    private userRepo: UserRepository;

    constructor() {
        this.userRepo = new UserRepository();
    }

    async getAll(): Promise<User[]> {
        return await this.userRepo.getAll();
    }

    async getById(id: number): Promise<User | null> {
        return await this.userRepo.getById(id);
    }

    async login(login: string, password: string): Promise<User | null> {
        return await this.userRepo.login(login, password);
    }

    async findByLogin(login: string): Promise<User | null> {
        return await this.userRepo.findByLogin(login);
    }

    async create(user: User): Promise<User | null> {
        return await this.userRepo.create(user);
    }

    async update(id: number, user: Partial<User>): Promise<User | null> {
        return await this.userRepo.update(id, user);
    }

    async delete(id: number): Promise<boolean> {
        return await this.userRepo.delete(id);
    }
}

export default UserService;
