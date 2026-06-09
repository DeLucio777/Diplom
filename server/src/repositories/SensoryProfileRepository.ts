import * as sql from 'mssql';
import { getPool } from '../config/dbConfig';
import SensoryProfile from '../entities/sensoryProfile';

export default class SensoryProfileRepository {
    
    async getByChild(childId: number): Promise<SensoryProfile | null> {
        const pool = getPool();
        if (!pool) throw new Error('Database not connected');
        
        const result = await pool.request()
            .input('childId', sql.Int, childId)
            .query('SELECT PK_ProfileId, FK_ChildId, BackgroundColor, FontSize, ExcludeLoudSounds, RewardAnimation FROM tbl_SensoryProfile WHERE FK_ChildId = @childId');
        
        if (result.recordset.length === 0) return null;
        return this.mapToSensoryProfile(result.recordset[0]);
    }

    async save(childId: number, data: Partial<SensoryProfile>): Promise<SensoryProfile | null> {
        const pool = getPool();
        if (!pool) throw new Error('Database not connected');
        
        // Check if exists
        const existing = await this.getByChild(childId);
        
        if (existing) {
            // Update
            await pool.request()
                .input('id', sql.Int, existing.PK_ProfileId)
                .input('backgroundColor', sql.VarChar(50), data.BackgroundColor)
                .input('fontSize', sql.Int, data.FontSize)
                .input('excludeLoudSounds', sql.Bit, data.ExcludeLoudSounds ? 1 : 0)
                .input('rewardAnimation', sql.VarChar(50), data.RewardAnimation)
                .query(`
                    UPDATE tbl_SensoryProfile 
                    SET BackgroundColor = @backgroundColor,
                        FontSize = @fontSize,
                        ExcludeLoudSounds = @excludeLoudSounds,
                        RewardAnimation = @rewardAnimation
                    WHERE PK_ProfileId = @id
                `);
        } else {
            // Create
            await pool.request()
                .input('childId', sql.Int, childId)
                .input('backgroundColor', sql.VarChar(50), data.BackgroundColor)
                .input('fontSize', sql.Int, data.FontSize)
                .input('excludeLoudSounds', sql.Bit, data.ExcludeLoudSounds ? 1 : 0)
                .input('rewardAnimation', sql.VarChar(50), data.RewardAnimation)
                .query(`
                    INSERT INTO tbl_SensoryProfile (FK_ChildId, BackgroundColor, FontSize, ExcludeLoudSounds, RewardAnimation)
                    VALUES (@childId, @backgroundColor, @fontSize, @excludeLoudSounds, @rewardAnimation);
                    SELECT SCOPE_IDENTITY() as Id;
                `);
        }
        
        return this.getByChild(childId);
    }

    private mapToSensoryProfile(row: any): SensoryProfile {
        const profile = new SensoryProfile();
        profile.PK_ProfileId = row.PK_ProfileId;
        profile.FK_ChildId = row.FK_ChildId;
        profile.BackgroundColor = row.BackgroundColor;
        profile.FontSize = row.FontSize;
        profile.ExcludeLoudSounds = row.ExcludeLoudSounds;
        profile.RewardAnimation = row.RewardAnimation;
        return profile;
    }
}