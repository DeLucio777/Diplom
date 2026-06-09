import * as sql from 'mssql';
import { getPool } from '../config/dbConfig';
import TaskTemplate from '../entities/taskTemplate';

export default class TaskTemplateRepository {
    
    async getAll(): Promise<TaskTemplate[]> {
        const pool = getPool();
        if (!pool) throw new Error('Database not connected');
        
        const result = await pool.request()
            .query('SELECT PK_MediaId, FileType, FilePath, Descripti, UploadDate FROM tbl_MediaCatalog');        
        return result.recordset.map((row: any) => this.mapToTemplate(row));
    }

    async getById(id: number): Promise<TaskTemplate | null> {
        const pool = getPool();
        if (!pool) throw new Error('Database not connected');
        
        const result = await pool.request()
            .input('id', sql.Int, id)
            .query('SELECT * FROM fun_GetTemplateById(@id)');
        
        if (result.recordset.length === 0) return null;
        return this.mapToTemplate(result.recordset[0]);
    }

    private mapToTemplate(row: any): TaskTemplate {
        const template = new TaskTemplate();
        template.PK_TemplateId = row.PK_TemplateId;
        template.TemplateName = row.TemplateName;
        template.Descripti = row.Descripti;
        return template;
    }
}
