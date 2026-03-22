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
}

export default UserService;
