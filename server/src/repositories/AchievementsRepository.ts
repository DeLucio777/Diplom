import { getConnection } from '../middlewares/dbConetxt';
import Achievement from '../entities/achievement';
import UsersAchievement from '../entities/usersAchievement';

class AchievementsRepository {
    async getAll(): Promise<Achievement[]> {
        const pool = await getConnection();
        const result = await pool.request()
            .query('SELECT * FROM Achievements');
        return result.recordset;
    }

    async getByUser(userId: number): Promise<UsersAchievement[]> {
        const pool = await getConnection();
        const result = await pool.request()
            .input('userId', userId)
            .query(`
                SELECT ua.*, a.name, a.description, a.icon 
                FROM UsersAchievements ua
                JOIN Achievements a ON ua.achivement_id = a.id
                WHERE ua.user_id = @userId
            `);
        return result.recordset;
    }

    async award(achievement: UsersAchievement): Promise<UsersAchievement | null> {
        const pool = await getConnection();
        const result = await pool.request()
            .input('userId', achievement.user_id)
            .input('achievementId', achievement.achivement_id)
            .input('awardedAt', achievement.awardedAt || new Date())
            .query(`
                INSERT INTO UsersAchievements (user_id, achivement_id, awardedAt)
                VALUES (@userId, @achievementId, @awardedAt);
                SELECT SCOPE_IDENTITY() as id;
            `);
        
        if (result.recordset && result.recordset[0]) {
            return { ...achievement, id: result.recordset[0].id };
        }
        return null;
    }
}

export default AchievementsRepository;