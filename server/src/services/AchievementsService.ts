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

    async create(achievement: Achievement): Promise<Achievement> {
        return await this.achievementsRepo.create(achievement);
    }

    async update(id: number, achievement: Achievement): Promise<Achievement | null> {
        return await this.achievementsRepo.update(id, achievement);
    }

    async getByUser(userId: number): Promise<UsersAchievement[]> {
        return await this.achievementsRepo.getByUser(userId);
    }

    async getAllUserAchievements(): Promise<UsersAchievement[]> {
        return await this.achievementsRepo.getAllUserAchievements();
    }

    async award(achievement: UsersAchievement | any): Promise<UsersAchievement | null> {
        const normalizedAchievement = this.normalizeUserAchievement(achievement);
        return await this.achievementsRepo.award(normalizedAchievement);
    }

    private normalizeUserAchievement(achievement: any): UsersAchievement {
        const normalized = new UsersAchievement();
        const nestedAchievement = achievement?.achievement ?? achievement?.Achievement;

        normalized.id = achievement?.id;
        normalized.user_id = achievement?.user_id ?? achievement?.userId;
        normalized.achivement_id =
            achievement?.achivement_id ??
            achievement?.achievementId ??
            achievement?.achievement_id ??
            nestedAchievement?.id;

        return normalized;
    }
}

export default AchievementsService;