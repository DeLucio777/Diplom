import * as sql from 'mssql';
import { getPool } from '../config/dbConfig';
import TaskList from '../entities/taskList';
import TaskListItem from '../entities/taskListItem';

export default class TaskListsRepository {
    async getAll(): Promise<TaskList[]> {
        const pool = getPool();
        if (!pool) throw new Error('Database not connected');

        const result = await pool.request()
            .query('SELECT PK_id, date_complite, teacher_id FROM tbl_task_list');

        return result.recordset.map((row: any) => this.mapToTaskList(row));
    }

    async getByTeacher(teacherId: number): Promise<TaskList[]> {
        const pool = getPool();
        if (!pool) throw new Error('Database not connected');

        const result = await pool.request()
            .input('teacherId', sql.Int, teacherId)
            .query('SELECT PK_id, date_complite, teacher_id FROM tbl_task_list WHERE teacher_id = @teacherId');

        return result.recordset.map((row: any) => this.mapToTaskList(row));
    }

    async getByUser(userId: number): Promise<TaskList[]> {
        const pool = getPool();
        if (!pool) throw new Error('Database not connected');

        const result = await pool.request()
            .input('userId', sql.Int, userId)
            .query(`
                SELECT DISTINCT tl.PK_id, tl.date_complite, tl.teacher_id
                FROM tbl_task_list tl
                JOIN tbl_task_lst_to_data tld ON tld.task_list_id = tl.PK_id
                WHERE tld.user_id = @userId
            `);

        return result.recordset.map((row: any) => this.mapToTaskList(row));
    }

    async getItems(listId: number): Promise<TaskListItem[]> {
        const pool = getPool();
        if (!pool) throw new Error('Database not connected');

        const result = await pool.request()
            .input('listId', sql.Int, listId)
            .query(`
                SELECT id, task_id, task_list_id, position, user_id, complited
                FROM tbl_task_lst_to_data
                WHERE task_list_id = @listId
                ORDER BY position
            `);

        return result.recordset.map((row: any) => this.mapToTaskListItem(row));
    }

    async getAllItems(): Promise<TaskListItem[]> {
        const pool = getPool();
        if (!pool) throw new Error('Database not connected');

        const result = await pool.request()
            .query(`
                SELECT id, task_id, task_list_id, position, user_id, complited
                FROM tbl_task_lst_to_data
                ORDER BY task_list_id, position
            `);

        return result.recordset.map((row: any) => this.mapToTaskListItem(row));
    }

    async getItemById(id: number): Promise<TaskListItem | null> {
        const pool = getPool();
        if (!pool) throw new Error('Database not connected');

        const result = await pool.request()
            .input('id', sql.Int, id)
            .query(`
                SELECT id, task_id, task_list_id, position, user_id, complited
                FROM tbl_task_lst_to_data
                WHERE id = @id
            `);

        if (result.recordset.length === 0) return null;
        return this.mapToTaskListItem(result.recordset[0]);
    }

    async getItemsForUser(listId: number, userId: number): Promise<TaskListItem[]> {
        const pool = getPool();
        if (!pool) throw new Error('Database not connected');

        const result = await pool.request()
            .input('listId', sql.Int, listId)
            .input('userId', sql.Int, userId)
            .query(`
                SELECT id, task_id, task_list_id, position, user_id, complited
                FROM tbl_task_lst_to_data
                WHERE task_list_id = @listId AND user_id = @userId
                ORDER BY position
            `);

        return result.recordset.map((row: any) => this.mapToTaskListItem(row));
    }

    async updateItemCompletion(itemId: number, completed: boolean): Promise<TaskListItem | null> {
        const pool = getPool();
        if (!pool) throw new Error('Database not connected');

        const result = await pool.request()
            .input('itemId', sql.Int, itemId)
            .input('completed', sql.Bit, completed ? 1 : 0)
            .query(`
                UPDATE tbl_task_lst_to_data
                SET complited = @completed
                WHERE id = @itemId;

                SELECT id, task_id, task_list_id, position, user_id, complited
                FROM tbl_task_lst_to_data
                WHERE id = @itemId;
            `);

        if (result.recordset.length === 0) return null;
        return this.mapToTaskListItem(result.recordset[0]);
    }

    async updateItemsForUser(taskListId: number, userId: number, completed: boolean): Promise<number> {
        const pool = getPool();
        if (!pool) throw new Error('Database not connected');

        const result = await pool.request()
            .input('taskListId', sql.Int, taskListId)
            .input('userId', sql.Int, userId)
            .input('completed', sql.Bit, completed ? 1 : 0)
            .query(`
                UPDATE tbl_task_lst_to_data
                SET complited = @completed
                WHERE task_list_id = @taskListId AND user_id = @userId;

                SELECT @@ROWCOUNT AS UpdatedRows;
            `);

        return result.recordset[0]?.UpdatedRows || 0;
    }

    async create(taskList: TaskList, taskIds: number[], userIds: number[]): Promise<TaskList | null> {
        const pool = getPool();
        if (!pool) throw new Error('Database not connected');

        const transaction = new sql.Transaction(pool);
        await transaction.begin();

        try {
            const listResult = await transaction.request()
                .input('dateComplete', sql.DateTime, taskList.date_complite || new Date())
                .input('teacherId', sql.Int, taskList.teacher_id)
                .query(`
                    DECLARE @listId INT = (SELECT COALESCE(MAX(PK_id), 0) + 1 FROM tbl_task_list WITH (UPDLOCK, HOLDLOCK));
                    DECLARE @itemId INT = (SELECT COALESCE(MAX(id), 0) + 1 FROM tbl_task_lst_to_data WITH (UPDLOCK, HOLDLOCK));

                    INSERT INTO tbl_task_list (PK_id, date_complite, teacher_id)
                    VALUES (@listId, @dateComplete, @teacherId);

                    SELECT @listId AS NextListId, @itemId AS NextItemId;
                `);

            const newListId = listResult.recordset[0]?.NextListId;
            let nextItemId = listResult.recordset[0]?.NextItemId;
            let position = 1;

            for (const taskId of taskIds) {
                for (const userId of userIds) {
                    await transaction.request()
                        .input('itemId', sql.Int, nextItemId)
                        .input('taskId', sql.Int, taskId)
                        .input('listId', sql.Int, newListId)
                        .input('position', sql.Int, position)
                        .input('userId', sql.Int, userId)
                        .query(`
                            INSERT INTO tbl_task_lst_to_data (id, task_id, task_list_id, position, user_id, complited)
                            VALUES (@itemId, @taskId, @listId, @position, @userId, 0);
                        `);

                    nextItemId++;
                    position++;
                }
            }

            await transaction.commit();
            return this.getById(newListId);
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }

    async getById(id: number): Promise<TaskList | null> {
        const pool = getPool();
        if (!pool) throw new Error('Database not connected');

        const result = await pool.request()
            .input('id', sql.Int, id)
            .query('SELECT PK_id, date_complite, teacher_id FROM tbl_task_list WHERE PK_id = @id');

        if (result.recordset.length === 0) return null;
        return this.mapToTaskList(result.recordset[0]);
    }

    async delete(id: number): Promise<boolean> {
        const pool = getPool();
        if (!pool) throw new Error('Database not connected');

        await pool.request()
            .input('id', sql.Int, id)
            .query('DELETE FROM tbl_task_lst_to_data WHERE task_list_id = @id');

        const result = await pool.request()
            .input('id', sql.Int, id)
            .query('DELETE FROM tbl_task_list WHERE PK_id = @id');

        return result.rowsAffected[0] > 0;
    }

    private mapToTaskList(row: any): TaskList {
        const list = new TaskList();
        list.PK_id = row.PK_id;
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
