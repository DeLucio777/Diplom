import AchievementsRepository from '../repositories/AchievementsRepository';
import Achievement from '../entities/achievement';
import UsersAchievement from '../entities/usersAchievement';

class AchievementsService {
    private achievementsRepo: AchievementsRepository;

    constructor() {
        this.achievementsRepo = new AchievementsRepository();
    }

    async getAll(): Promise<Achievement[]> {
        return await this.achievementsRepo.getAll();
    }

    async getByUser(userId: number): Promise<UsersAchievement[]> {
        return await this.achievementsRepo.getByUser(userId);
    }

    async getAllUserAchievements(): Promise<UsersAchievement[]> {
        return await this.achievementsRepo.getAllUserAchievements();
    }

    async award(achievement: UsersAchievement): Promise<UsersAchievement | null> {
        return await this.achievementsRepo.award(achievement);
    }
}

export default AchievementsService;