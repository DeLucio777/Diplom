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

    async create(achievement: Achievement): Promise<Achievement> {
        const pool = await getConnection();
        if (!pool) throw new Error('Database not connected');

        const result = await pool.request()
            .input('description', sql.VarChar(255), achievement.description || null)
            .input('name', sql.VarChar(255), achievement.name || null)
            .input('imageId', sql.Int, achievement.image_id || null)
            .query(`
                INSERT INTO tbl_achievement (description, name, image_id)
                OUTPUT INSERTED.id, INSERTED.description, INSERTED.name, INSERTED.image_id
                VALUES (@description, @name, @imageId);
            `);

        return this.mapToAchievement(result.recordset[0]);
    }

    async update(id: number, achievement: Achievement): Promise<Achievement | null> {
        const pool = await getConnection();
        if (!pool) throw new Error('Database not connected');

        const result = await pool.request()
            .input('achievementId', sql.Int, id)
            .input('description', sql.VarChar(255), achievement.description || null)
            .input('name', sql.VarChar(255), achievement.name || null)
            .input('imageId', sql.Int, achievement.image_id ?? null)
            .query(`
                UPDATE tbl_achievement
                SET
                    description = COALESCE(@description, description),
                    name = COALESCE(@name, name),
                    image_id = COALESCE(@imageId, image_id)
                WHERE id = @achievementId;

                SELECT id, description, name, image_id
                FROM tbl_achievement
                WHERE id = @achievementId;
            `);

        return result.recordset[0] ? this.mapToAchievement(result.recordset[0]) : null;
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

        console.log("=== AWARD START ===");
        console.log("RAW INPUT:", JSON.stringify(achievement));

        const transaction = new sql.Transaction(pool);
        await transaction.begin();

        try {
            console.log("CHECKING IF ALREADY EXISTS...");

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

            console.log("EXISTING RESULT:", JSON.stringify(existingResult.recordset));

            if (existingResult.recordset.length > 0) {
                console.log("ALREADY HAS ACHIEVEMENT → RETURNING EXISTING");
                await transaction.commit();
                return this.mapToUsersAchievement(existingResult.recordset[0]);
            }

            console.log("INSERTING NEW ACHIEVEMENT...");
            console.log("INSERT DATA:", {
                userId: achievement.user_id,
                achievementId: achievement.achivement_id
            });

            const result = await transaction.request()
                .input('userId', sql.Int, achievement.user_id)
                .input('achievementId', sql.Int, achievement.achivement_id)
                .query(`
                    INSERT INTO tbl_users_achievement (achivement_id, user_id)
                    VALUES (@achievementId, @userId);

                    SELECT SCOPE_IDENTITY() AS id;
                `);

            console.log("INSERT RESULT:", JSON.stringify(result.recordset));

            await transaction.commit();

            if (result.recordset && result.recordset[0]) {
                console.log("=== AWARD SUCCESS ===");
                return {
                    ...achievement,
                    id: result.recordset[0].id
                };
            }

            console.log("=== AWARD FAILED: NO RESULT ===");
            return null;

        } catch (error) {
            console.error("=== AWARD ERROR ===", error);
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
