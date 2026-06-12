import * as sql from 'mssql';
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
                    u.UserLogin AS User_UserLogin,
                    u.first_name AS User_first_name,
                    u.second_name AS User_second_name,
                    u.phone AS User_phone,
                    u.email AS User_email
                FROM tbl_Task t
                LEFT JOIN tbl_TaskTemplate tt ON tt.PK_TemplateId = t.FK_TemplateId
                LEFT JOIN tbl_User u ON u.PK_UserId = t.FK_UserId
            `);

        return result.recordset.map((row: any) => this.mapToTask(row));
    }

    async getById(id: number): Promise<Task | null> {
        const pool = getPool();
        if (!pool) throw new Error('Database not connected');

        const result = await pool.request()
            .input('id', sql.Int, id)
            .query(`
                SELECT
                    t.PK_TaskId,
                    t.Title,
                    t.Descripti,
                    t.FK_TemplateId,
                    t.FK_UserId,
                    t.DifficultyLevel,
                    t.UploadDate,
                    t.public_task
                FROM tbl_Task t
                WHERE t.PK_TaskId = @id
            `);

        if (result.recordset.length === 0) return null;
        return this.mapToTask(result.recordset[0]);
    }

    async create(task: Task): Promise<number> {
        const pool = getPool();
        if (!pool) throw new Error('Database not connected');

        const result = await pool.request()
            .input('title', sql.VarChar(50), task.Title)
            .input('description', sql.VarChar(50), task.Descripti || null)
            .input('templateId', sql.Int, task.FK_TemplateId)
            .input('userId', sql.Int, task.FK_UserId)
            .input('difficultyLevel', sql.VarChar(50), task.DifficultyLevel)
            .input('publicTask', sql.Bit, task.public_task ? 1 : 0)
            .query(`
                INSERT INTO tbl_Task (Title, Descripti, FK_TemplateId, FK_UserId, DifficultyLevel, UploadDate, public_task)
                VALUES (@title, @description, @templateId, @userId, @difficultyLevel, GETDATE(), @publicTask);
                SELECT SCOPE_IDENTITY() AS id;
            `);

        return result.recordset[0]?.id || 0;
    }

    async update(id: number, task: Task): Promise<boolean> {
        const pool = getPool();
        if (!pool) throw new Error('Database not connected');

        const result = await pool.request()
            .input('id', sql.Int, id)
            .input('title', sql.VarChar(50), task.Title)
            .input('description', sql.VarChar(50), task.Descripti || null)
            .input('templateId', sql.Int, task.FK_TemplateId)
            .input('userId', sql.Int, task.FK_UserId)
            .input('difficulty', sql.VarChar(50), task.DifficultyLevel)
            .input('publicTask', sql.Bit, task.public_task ? 1 : 0)
            .query(`
                UPDATE tbl_Task
                SET Title = @title,
                    Descripti = @description,
                    FK_TemplateId = @templateId,
                    FK_UserId = @userId,
                    DifficultyLevel = @difficulty,
                    public_task = @publicTask
                WHERE PK_TaskId = @id
            `);

        return result.rowsAffected[0] > 0;
    }

    async delete(id: number): Promise<boolean> {
        const pool = getPool();
        if (!pool) throw new Error('Database not connected');

        const transaction = new sql.Transaction(pool);
        await transaction.begin();

        try {
            await transaction.request()
                .input('id', sql.Int, id)
                .query(`
                    DELETE FROM tbl_TaskConstruction WHERE FK_TaskId = @id;
                    DELETE FROM tbl_FindOddOneOutItems WHERE FK_TaskId = @id;
                    DELETE FROM tbl_MatchImageWordPairs WHERE FK_TaskId = @id;
                    DELETE FROM tbl_SequenceItems WHERE FK_TaskId = @id;
                    DELETE FROM tbl_SortItems WHERE FK_TaskId = @id;
                    DELETE FROM tbl_task_lst_to_data WHERE task_id = @id;
                `);

            const result = await transaction.request()
                .input('id', sql.Int, id)
                .query('DELETE FROM tbl_Task WHERE PK_TaskId = @id');

            await transaction.commit();
            return result.rowsAffected[0] > 0;
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }

    async publish(taskId: number, published: boolean): Promise<boolean> {
        const pool = getPool();
        if (!pool) throw new Error('Database not connected');

        const result = await pool.request()
            .input('id', sql.Int, taskId)
            .input('published', sql.Bit, published ? 1 : 0)
            .query('UPDATE tbl_Task SET public_task = @published WHERE PK_TaskId = @id');

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
        task.public_task = Boolean(row.public_task);

        if (row.Template_PK_TemplateId) {
            task.Template = {
                PK_TemplateId: row.Template_PK_TemplateId,
                TemplateName: row.Template_TemplateName,
                Descripti: row.Template_Descripti
            };
        }

        if (row.User_PK_UserId) {
            task.User = {
                PK_UserId: row.User_PK_UserId,
                UserLogin: row.User_UserLogin,
                UserPassword: '',
                FK_RoleId: undefined,
                first_name: row.User_first_name,
                second_name: row.User_second_name,
                phone: row.User_phone,
                email: row.User_email
            };
        }

        return task;
    }
}
