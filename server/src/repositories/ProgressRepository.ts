import * as sql from 'mssql';
import { getPool } from '../config/dbConfig';
import ProgressRecord from '../entities/progressRecord';

export default class ProgressRepository {
    async getAll(userId?: number): Promise<ProgressRecord[]> {
        const pool = getPool();
        if (!pool) throw new Error('Database not connected');

        const request = pool.request();
        let query = `
            SELECT
                tld.id,
                tld.user_id,
                tld.task_id,
                tld.task_list_id,
                tld.complited,
                ci.complited_tasks_count,
                ci.helpe_used_count,
                ci.miss_tasks_count,
                ci.age,
                ci.speak_level
            FROM tbl_task_lst_to_data tld
            LEFT JOIN tbl_childInfo ci ON ci.FK_user_id = tld.user_id
        `;

        if (userId) {
            request.input('userId', sql.Int, userId);
            query += ' WHERE tld.user_id = @userId';
        }

        query += ' ORDER BY tld.user_id, tld.task_list_id, tld.position';

        const result = await request.query(query);
        return result.recordset.map((row: any) => this.mapToProgress(row));
    }

    private mapToProgress(row: any): ProgressRecord {
        const progress = new ProgressRecord();
        progress.id = row.id;
        progress.user_id = row.user_id;
        progress.task_id = row.task_id;
        progress.task_list_id = row.task_list_id;
        progress.completed = Boolean(row.complited);
        progress.completed_tasks_count = row.complited_tasks_count;
        progress.helps_used_count = row.helpe_used_count;
        progress.missed_tasks_count = row.miss_tasks_count;
        progress.age = row.age;
        progress.speak_level = row.speak_level;
        return progress;
    }
}
