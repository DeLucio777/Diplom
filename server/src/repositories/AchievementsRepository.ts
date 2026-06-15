import { getConnection } from '../middlewares/dbConetxt';
import * as sql from 'mssql';
import Achievement from '../entities/achievement';
import UsersAchievement from '../entities/usersAchievement';

class AchievementsRepository {
    async getAll(): Promise<Achievement[]> {
        const pool = await getConnection();
        if (!pool) throw new Error('Database not connected');

        const result = await pool.request()
            .query('SELECT id, description, name, image_id FROM tbl_achievement');

        return result.recordset.map((row: any) => this.mapToAchievement(row));
    }

    async getByUser(userId: number): Promise<UsersAchievement[]> {
        const pool = await getConnection();
        if (!pool) throw new Error('Database not connected');

        const result = await pool.request()
            .input('userId', sql.Int, userId)
            .query(`
                SELECT
                    ua.id,
                    ua.achivement_id,
                    ua.user_id,
                    a.description,
                    a.name,
                    a.image_id
                FROM tbl_users_achievement ua
                JOIN tbl_achievement a ON a.id = ua.achivement_id
                WHERE ua.user_id = @userId
            `);

        return result.recordset.map((row: any) => this.mapToUsersAchievement(row));
    }

    async getAllUserAchievements(): Promise<UsersAchievement[]> {
        const pool = await getConnection();
        if (!pool) throw new Error('Database not connected');

        const result = await pool.request()
            .query(`
                SELECT
                    ua.id,
                    ua.achivement_id,
                    ua.user_id,
                    a.description,
                    a.name,
                    a.image_id
                FROM tbl_users_achievement ua
                JOIN tbl_achievement a ON a.id = ua.achivement_id
            `);

        return result.recordset.map((row: any) => this.mapToUsersAchievement(row));
    }

    async award(achievement: UsersAchievement): Promise<UsersAchievement | null> {
        const pool = await getConnection();
        if (!pool) throw new Error('Database not connected');

        const transaction = new sql.Transaction(pool);
        await transaction.begin();

        try {
            const existingResult = await transaction.request()
                .input('userId', sql.Int, achievement.user_id)
                .input('achievementId', sql.Int, achievement.achivement_id)
                .query(`
                    SELECT
                        ua.id,
                        ua.achivement_id,
                        ua.user_id,
                        a.description,
                        a.name,
                        a.image_id
                    FROM tbl_users_achievement ua
                    JOIN tbl_achievement a ON a.id = ua.achivement_id
                    WHERE ua.user_id = @userId AND ua.achivement_id = @achievementId
                `);

            if (existingResult.recordset.length > 0) {
                await transaction.commit();
                return this.mapToUsersAchievement(existingResult.recordset[0]);
            }

            const result = await transaction.request()
                .input('userId', sql.Int, achievement.user_id)
                .input('achievementId', sql.Int, achievement.achivement_id)
                .query(`
                    DECLARE @id INT = (SELECT COALESCE(MAX(id), 0) + 1 FROM tbl_users_achievement WITH (UPDLOCK, HOLDLOCK));

                    INSERT INTO tbl_users_achievement (id, achivement_id, user_id)
                    VALUES (@id, @achievementId, @userId);

                    SELECT @id AS id;
                `);

            await transaction.commit();

            if (result.recordset && result.recordset[0]) {
                return {
                    ...achievement,
                    id: result.recordset[0].id
                };
            }
            return null;
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }

    private mapToAchievement(row: any): Achievement {
        const achievement = new Achievement();
        achievement.id = row.id;
        achievement.description = row.description;
        achievement.name = row.name;
        achievement.image_id = row.image_id;
        return achievement;
    }

    private mapToUsersAchievement(row: any): UsersAchievement {
        const usersAchievement = new UsersAchievement();
        usersAchievement.id = row.id;
        usersAchievement.achivement_id = row.achivement_id;
        usersAchievement.user_id = row.user_id;
        usersAchievement.Achievement = {
            id: row.achivement_id,
            description: row.description,
            name: row.name,
            image_id: row.image_id
        };
        return usersAchievement;
    }
}

export default AchievementsRepository;
