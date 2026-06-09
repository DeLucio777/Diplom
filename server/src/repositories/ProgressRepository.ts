import sql from 'mssql';
import { getPool } from '../config/dbConfig';
import ProgressRecord from '../entities/progressRecord';

export default class ProgressRepository {
    
    async getAll(): Promise<ProgressRecord[]> {
        const pool = getPool();
        if (!pool) throw new Error('Database not connected');
        
        const result = await pool.request()
            .query('SELECT PK_ProgressId, FK_AssignmentId, FK_ChildId, CompletedDate, ErrorCount, HintsUsed, TimeTakenSeconds, IsCorrect FROM tbl_Progress');
        
        return result.recordset.map((row: any) => this.mapToProgress(row));
    }

    async getByChild(childId: number): Promise<ProgressRecord[]> {
        const pool = getPool();
        if (!pool) throw new Error('Database not connected');
        
        const result = await pool.request()
            .input('childId', sql.Int, childId)
            .query('SELECT PK_ProgressId, FK_AssignmentId, FK_ChildId, CompletedDate, ErrorCount, HintsUsed, TimeTakenSeconds, IsCorrect FROM tbl_Progress WHERE FK_ChildId = @childId');
        
        return result.recordset.map((row: any) => this.mapToProgress(row));
    }

    async create(progress: ProgressRecord): Promise<ProgressRecord | null> {
        const pool = getPool();
        if (!pool) throw new Error('Database not connected');
        
        const result = await pool.request()
            .input('assignmentId', sql.Int, progress.FK_AssignmentId)
            .input('childId', sql.Int, progress.FK_ChildId)
            .input('errorCount', sql.Int, progress.ErrorCount)
            .input('hintsUsed', sql.Int, progress.HintsUsed)
            .input('timeTaken', sql.Int, progress.TimeTakenSeconds)
            .input('isCorrect', sql.Bit, progress.IsCorrect ? 1 : 0)
            .query(`
                INSERT INTO tbl_Progress (FK_AssignmentId, FK_ChildId, CompletedDate, ErrorCount, HintsUsed, TimeTakenSeconds, IsCorrect)
                VALUES (@assignmentId, @childId, GETDATE(), @errorCount, @hintsUsed, @timeTaken, @isCorrect);
                SELECT SCOPE_IDENTITY() as Id;
            `);
        
        const newId = result.recordset[0]?.Id;
        if (newId) {
            return this.getById(newId);
        }
        return null;
    }

    async getById(id: number): Promise<ProgressRecord | null> {
        const pool = getPool();
        if (!pool) throw new Error('Database not connected');
        
        const result = await pool.request()
            .input('id', sql.Int, id)
            .query('SELECT PK_ProgressId, FK_AssignmentId, FK_ChildId, CompletedDate, ErrorCount, HintsUsed, TimeTakenSeconds, IsCorrect FROM tbl_Progress WHERE PK_ProgressId = @id');
        
        if (result.recordset.length === 0) return null;
        return this.mapToProgress(result.recordset[0]);
    }

    private mapToProgress(row: any): ProgressRecord {
        const progress = new ProgressRecord();
        progress.PK_ProgressId = row.PK_ProgressId;
        progress.FK_AssignmentId = row.FK_AssignmentId;
        progress.FK_ChildId = row.FK_ChildId;
        progress.CompletedDate = row.CompletedDate;
        progress.ErrorCount = row.ErrorCount;
        progress.HintsUsed = row.HintsUsed;
        progress.TimeTakenSeconds = row.TimeTakenSeconds;
        progress.IsCorrect = row.IsCorrect;
        return progress;
    }
}