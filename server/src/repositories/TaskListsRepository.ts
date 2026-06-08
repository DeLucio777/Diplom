import sql from 'mssql';
import { getPool } from '../config/dbConfig';
import TaskList from '../entities/taskList';
import TaskListItem from '../entities/taskListItem';

export default class TaskListsRepository {
    
    async getAll(): Promise<TaskList[]> {
        const pool = getPool();
        if (!pool) throw new Error('Database not connected');
        
        const result = await pool.request()
            .query('SELECT PK_id, Title, Descripti, date_complite, teacher_id FROM tbl_task_list');
        
        return result.recordset.map((row: any) => this.mapToTaskList(row));
    }

    async getByTeacher(teacherId: number): Promise<TaskList[]> {
        const pool = getPool();
        if (!pool) throw new Error('Database not connected');
        
        const result = await pool.request()
            .input('teacherId', sql.Int, teacherId)
            .query('SELECT PK_id, Title, Descripti, date_complite, teacher_id FROM tbl_task_list WHERE teacher_id = @teacherId');
        
        return result.recordset.map((row: any) => this.mapToTaskList(row));
    }

    async getByUser(userId: number): Promise<TaskList[]> {
        const pool = getPool();
        if (!pool) throw new Error('Database not connected');
        
        const result = await pool.request()
            .input('userId', sql.Int, userId)
            .query(`
                SELECT DISTINCT tl.PK_id, tl.Title, tl.Descripti, tl.date_complite, tl.teacher_id 
                FROM tbl_task_list tl
                JOIN tbl_task_lst_to_data tld ON tl.PK_id = tld.FK_task_list_id
                WHERE tld.FK_user_id = @userId
            `);
        
        return result.recordset.map((row: any) => this.mapToTaskList(row));
    }

    async getItems(listId: number): Promise<TaskListItem[]> {
        const pool = getPool();
        if (!pool) throw new Error('Database not connected');
        
        const result = await pool.request()
            .input('listId', sql.Int, listId)
            .query('SELECT id, task_id, task_list_id, position, user_id, complited FROM tbl_task_lst_to_data WHERE task_list_id = @listId');
        
        return result.recordset.map((row: any) => this.mapToTaskListItem(row));
    }

    async getItemsForUser(listId: number, userId: number): Promise<TaskListItem[]> {
        const pool = getPool();
        if (!pool) throw new Error('Database not connected');
        
        const result = await pool.request()
            .input('listId', sql.Int, listId)
            .input('userId', sql.Int, userId)
            .query('SELECT id, task_id, task_list_id, position, user_id, complited FROM tbl_task_lst_to_data WHERE task_list_id = @listId AND user_id = @userId');
        
        return result.recordset.map((row: any) => this.mapToTaskListItem(row));
    }

    async create(taskList: TaskList, taskIds: number[], userIds: number[]): Promise<TaskList | null> {
        const pool = getPool();
        if (!pool) throw new Error('Database not connected');
        
        const result = await pool.request()
            .input('title', sql.VarChar(100), taskList.Title)
            .input('description', sql.VarChar(255), taskList.Descripti)
            .input('dateComplete', sql.DateTime, taskList.date_complite)
            .input('teacherId', sql.Int, taskList.teacher_id)
            .query(`
                INSERT INTO tbl_task_list (Title, Descripti, date_complite, teacher_id)
                VALUES (@title, @description, @dateComplete, @teacherId);
                SELECT SCOPE_IDENTITY() as Id;
            `);
        
        const newListId = result.recordset[0]?.Id;
        
        // Add items
        for (const taskId of taskIds) {
            for (const userId of userIds) {
                await pool.request()
                    .input('taskId', sql.Int, taskId)
                    .input('listId', sql.Int, newListId)
                    .input('userId', sql.Int, userId)
                    .query(`
                        INSERT INTO tbl_task_lst_to_data (task_id, task_list_id, user_id, position, complited)
                        VALUES (@taskId, @listId, @userId, 0, 0);
                    `);
            }
        }
        
        return this.getById(newListId);
    }

    async getById(id: number): Promise<TaskList | null> {
        const pool = getPool();
        if (!pool) throw new Error('Database not connected');
        
        const result = await pool.request()
            .input('id', sql.Int, id)
            .query('SELECT PK_id, Title, Descripti, date_complite, teacher_id FROM tbl_task_list WHERE PK_id = @id');
        
        if (result.recordset.length === 0) return null;
        return this.mapToTaskList(result.recordset[0]);
    }

    async delete(id: number): Promise<boolean> {
        const pool = getPool();
        if (!pool) throw new Error('Database not connected');
        
        // Delete items first
        await pool.request()
            .input('id', sql.Int, id)
            .query('DELETE FROM tbl_task_lst_to_data WHERE task_list_id = @id');
        
        // Delete list
        const result = await pool.request()
            .input('id', sql.Int, id)
            .query('DELETE FROM tbl_task_list WHERE PK_id = @id');
        
        return result.rowsAffected[0] > 0;
    }

    private mapToTaskList(row: any): TaskList {
        const list = new TaskList();
        list.PK_id = row.PK_id;
        list.Title = row.Title;
        list.Descripti = row.Descripti;
        list.date_complite = row.date_complite;
        list.teacher_id = row.teacher_id;
        return list;
    }

    private mapToTaskListItem(row: any): TaskListItem {
        const item = new TaskListItem();
        item.id = row.id;
        item.task_id = row.task_id;
        item.task_list_id = row.task_list_id;
        item.position = row.position;
        item.user_id = row.user_id;
        item.complited = row.complited;
        return item;
    }
}