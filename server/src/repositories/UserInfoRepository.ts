import * as sql from 'mssql';
import { getPool } from '../config/dbConfig';
import UserInfo from '../entities/userInfo';

export default class UserInfoRepository {
    async getAll(): Promise<UserInfo[]> {
        const pool = getPool();
        if (!pool) throw new Error('Database not connected');

        const result = await pool.request()
            .query(`
                SELECT PK_Id, FK_user_id, FK_disease_id, complited_tasks_count,
                       helpe_used_count, miss_tasks_count, age, speak_level
                FROM tbl_childInfo
            `);

        return result.recordset.map((row: any) => this.mapToUserInfo(row));
    }

    async getById(id: number): Promise<UserInfo | null> {
        const pool = getPool();
        if (!pool) throw new Error('Database not connected');

        const result = await pool.request()
            .input('id', sql.Int, id)
            .query(`
                SELECT PK_Id, FK_user_id, FK_disease_id, complited_tasks_count,
                       helpe_used_count, miss_tasks_count, age, speak_level
                FROM tbl_childInfo
                WHERE PK_Id = @id
            `);

        if (result.recordset.length === 0) return null;
        return this.mapToUserInfo(result.recordset[0]);
    }

    async getByUser(userId: number): Promise<UserInfo | null> {
        const pool = getPool();
        if (!pool) throw new Error('Database not connected');

        const result = await pool.request()
            .input('userId', sql.Int, userId)
            .query(`
                SELECT PK_Id, FK_user_id, FK_disease_id, complited_tasks_count,
                       helpe_used_count, miss_tasks_count, age, speak_level
                FROM tbl_childInfo
                WHERE FK_user_id = @userId
            `);

        if (result.recordset.length === 0) return null;
        return this.mapToUserInfo(result.recordset[0]);
    }

    async save(userId: number, data: Partial<UserInfo>): Promise<UserInfo | null> {
        const pool = getPool();
        if (!pool) throw new Error('Database not connected');

        const existing = await this.getByUser(userId);

        if (existing) {
            await pool.request()
                .input('id', sql.Int, existing.PK_Id)
                .input('diseaseId', sql.Int, data.FK_disease_id ?? existing.FK_disease_id ?? null)
                .input('completedTasksCount', sql.Int, data.complited_tasks_count ?? existing.complited_tasks_count ?? null)
                .input('helpsUsedCount', sql.Int, data.helpe_used_count ?? existing.helpe_used_count ?? null)
                .input('missTasksCount', sql.Int, data.miss_tasks_count ?? existing.miss_tasks_count ?? null)
                .input('age', sql.Int, data.age ?? existing.age ?? null)
                .input('speakLevel', sql.NVarChar(100), data.speak_level ?? existing.speak_level ?? null)
                .query(`
                    UPDATE tbl_childInfo
                    SET FK_disease_id = @diseaseId,
                        complited_tasks_count = @completedTasksCount,
                        helpe_used_count = @helpsUsedCount,
                        miss_tasks_count = @missTasksCount,
                        age = @age,
                        speak_level = @speakLevel
                    WHERE PK_Id = @id
                `);
        } else {
            await pool.request()
                .input('userId', sql.Int, userId)
                .input('diseaseId', sql.Int, data.FK_disease_id ?? null)
                .input('completedTasksCount', sql.Int, data.complited_tasks_count ?? null)
                .input('helpsUsedCount', sql.Int, data.helpe_used_count ?? null)
                .input('missTasksCount', sql.Int, data.miss_tasks_count ?? null)
                .input('age', sql.Int, data.age ?? null)
                .input('speakLevel', sql.NVarChar(100), data.speak_level ?? null)
                .query(`
                    INSERT INTO tbl_childInfo
                        (FK_user_id, FK_disease_id, complited_tasks_count, helpe_used_count, miss_tasks_count, age, speak_level)
                    VALUES
                        (@userId, @diseaseId, @completedTasksCount, @helpsUsedCount, @missTasksCount, @age, @speakLevel);
                    SELECT SCOPE_IDENTITY() AS Id;
                `);
        }

        return this.getByUser(userId);
    }

    private mapToUserInfo(row: any): UserInfo {
        const info = new UserInfo();
        info.PK_Id = row.PK_Id;
        info.FK_user_id = row.FK_user_id;
        info.FK_disease_id = row.FK_disease_id;
        info.complited_tasks_count = row.complited_tasks_count;
        info.helpe_used_count = row.helpe_used_count;
        info.miss_tasks_count = row.miss_tasks_count;
        info.age = row.age;
        info.speak_level = row.speak_level;
        return info;
    }
}
