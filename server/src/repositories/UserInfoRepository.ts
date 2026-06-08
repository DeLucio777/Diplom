import sql from 'mssql';
import { getPool } from '../config/dbConfig';
import UserInfo from '../entities/userInfo';

export default class UserInfoRepository {
    
    async getByUser(userId: number): Promise<UserInfo | null> {
        const pool = getPool();
        if (!pool) throw new Error('Database not connected');
        
        const result = await pool.request()
            .input('userId', sql.Int, userId)
            .query('SELECT PK_Id, FK_user_id, FK_disease_id, complited_tasks_count, helpe_used_count, miss_tasks_count, age, PerceptionFeatures, SpeechLevel, BackgroundColor, FontSize, ExcludeLoudSounds, RewardAnimation, FK_RepresentativeUserId, FK_EducatorUserId FROM tbl_user_info WHERE FK_user_id = @userId');
        
        if (result.recordset.length === 0) return null;
        return this.mapToUserInfo(result.recordset[0]);
    }

    async save(userId: number, data: Partial<UserInfo>): Promise<UserInfo | null> {
        const pool = getPool();
        if (!pool) throw new Error('Database not connected');
        
        // Check if exists
        const existing = await this.getByUser(userId);
        
        if (existing) {
            // Update
            await pool.request()
                .input('id', sql.Int, existing.PK_Id)
                .input('diseaseId', sql.Int, data.FK_disease_id)
                .input('perceptionFeatures', sql.VarChar(255), data.PerceptionFeatures)
                .input('speechLevel', sql.VarChar(50), data.SpeechLevel)
                .input('backgroundColor', sql.VarChar(50), data.BackgroundColor)
                .input('fontSize', sql.Int, data.FontSize)
                .input('excludeLoudSounds', sql.Bit, data.ExcludeLoudSounds ? 1 : 0)
                .input('rewardAnimation', sql.VarChar(50), data.RewardAnimation)
                .query(`
                    UPDATE tbl_user_info 
                    SET FK_disease_id = @diseaseId,
                        PerceptionFeatures = @perceptionFeatures,
                        SpeechLevel = @speechLevel,
                        BackgroundColor = @backgroundColor,
                        FontSize = @fontSize,
                        ExcludeLoudSounds = @excludeLoudSounds,
                        RewardAnimation = @rewardAnimation
                    WHERE PK_Id = @id
                `);
        } else {
            // Create
            await pool.request()
                .input('userId', sql.Int, userId)
                .input('diseaseId', sql.Int, data.FK_disease_id)
                .input('perceptionFeatures', sql.VarChar(255), data.PerceptionFeatures)
                .input('speechLevel', sql.VarChar(50), data.SpeechLevel)
                .input('backgroundColor', sql.VarChar(50), data.BackgroundColor)
                .input('fontSize', sql.Int, data.FontSize)
                .input('excludeLoudSounds', sql.Bit, data.ExcludeLoudSounds ? 1 : 0)
                .input('rewardAnimation', sql.VarChar(50), data.RewardAnimation)
                .query(`
                    INSERT INTO tbl_user_info (FK_user_id, FK_disease_id, PerceptionFeatures, SpeechLevel, BackgroundColor, FontSize, ExcludeLoudSounds, RewardAnimation)
                    VALUES (@userId, @diseaseId, @perceptionFeatures, @speechLevel, @backgroundColor, @fontSize, @excludeLoudSounds, @rewardAnimation);
                    SELECT SCOPE_IDENTITY() as Id;
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
        info.PerceptionFeatures = row.PerceptionFeatures;
        info.SpeechLevel = row.SpeechLevel;
        info.BackgroundColor = row.BackgroundColor;
        info.FontSize = row.FontSize;
        info.ExcludeLoudSounds = row.ExcludeLoudSounds;
        info.RewardAnimation = row.RewardAnimation;
        info.FK_RepresentativeUserId = row.FK_RepresentativeUserId;
        info.FK_EducatorUserId = row.FK_EducatorUserId;
        return info;
    }
}