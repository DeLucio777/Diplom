import sql from 'mssql';
import { getPool } from '../config/dbConfig';
import Task from '../entities/task';

export default class TaskRepository {
    
    async getAll(): Promise<Task[]> {
        const pool = getPool();
        if (!pool) throw new Error('Database not connected');
        
        const result = await pool.request()
            .query(`
                SELECT
                    t.PK_TaskId,
                    t.Title,
                    t.Descripti,
                    t.FK_TemplateId,
                    t.FK_UserId,
                    t.DifficultyLevel,
                    t.UploadDate,
                    t.public_task,

                    tt.PK_TemplateId AS Template_PK_TemplateId,
                    tt.TemplateName AS Template_TemplateName,
                    tt.Descripti AS Template_Descripti,

                    u.PK_UserId AS User_PK_UserId,
                    u.first_name AS User_first_name,
                    u.second_name AS User_second_name,
                    u.phone AS User_phone
                FROM tbl_Task t
                         LEFT JOIN tbl_TaskTemplate tt ON t.FK_TemplateId = tt.PK_TemplateId
                         LEFT JOIN tbl_User u ON t.FK_UserId = u.PK_UserId
            `);
        
        return result.recordset.map((row: any) => this.mapToTask(row));
    }

    async getById(id: number): Promise<Task | null> {
        const pool = getPool();
        if (!pool) throw new Error('Database not connected');
        
        const result = await pool.request()
            .input('id', sql.Int, id)
            .query(` SELECT * FROM fun_GetTaskById(@id) `);
        
        if (result.recordset.length === 0) return null;
        return this.mapToTask(result.recordset[0]);
    }

    async create(task: Task): Promise<number> {
        const pool = getPool();
        if (!pool) throw new Error('Database not connected');
        const result = await pool.request()
            .input('title', sql.VarChar(50), task.Title)
            .input('description', sql.VarChar(50), task.Descripti)
            .input('templateId', sql.Int, task.FK_TemplateId)
            .input('userId', sql.Int, task.FK_UserId)
            .input('difficulty', sql.VarChar(50), task.DifficultyLevel)
            .query(`
                INSERT INTO tbl_Task (Title, Descripti, FK_TemplateId, FK_UserId, DifficultyLevel, UploadDate)
                VALUES (@title, @description, @templateId, @userId, @difficulty, GETDATE());
                SELECT SCOPE_IDENTITY() as Id;
            `);
        
        return result.recordset[0].Id;
    }

    async update(id: number, task: Task): Promise<boolean> {
        const pool = getPool();
        if (!pool) throw new Error('Database not connected');
        
        const result = await pool.request()
            .input('id', sql.Int, id)
            .input('title', sql.VarChar(50), task.Title)
            .input('description', sql.VarChar(50), task.Descripti)
            .input('difficulty', sql.VarChar(50), task.DifficultyLevel)
            .query(`
                UPDATE tbl_Task 
                SET Title = @title, 
                    Descripti = @description, 
                    DifficultyLevel = @difficulty
                WHERE PK_TaskId = @id
            `);
        
        return result.rowsAffected[0] > 0;
    }

    async delete(id: number): Promise<boolean> {
        const pool = getPool();
        if (!pool) throw new Error('Database not connected');
        
        const result = await pool.request()
            .input('id', sql.Int, id)
            .query('DELETE FROM tbl_Task WHERE PK_TaskId = @id');
        
        return result.rowsAffected[0] > 0;
    }

    private mapToTask(row: any): Task {
        const task = new Task();
        task.PK_TaskId = row.PK_TaskId;
        task.Title = row.Title;
        task.Descripti = row.Descripti;
        task.FK_TemplateId = row.FK_TemplateId;
        task.FK_UserId = row.FK_UserId;
        task.DifficultyLevel = row.DifficultyLevel;
        task.UploadDate = row.UploadDate;
        return task;
    }
}
