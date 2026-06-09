import sql from 'mssql';
import { getPool } from '../config/dbConfig';
import MediaCatalog from '../entities/mediaCatalog';

export default class MediaRepository {
    
    async getAll(): Promise<MediaCatalog[]> {
        const pool = getPool();
        if (!pool) throw new Error('Database not connected');
        
        const result = await pool.request()
            .query('select * from tbl_MediaCatalog');
        
        return result.recordset.map((row: any) => this.mapToMedia(row));
    }

    async getById(id: number): Promise<MediaCatalog | null> {
        const pool = getPool();
        if (!pool) throw new Error('Database not connected');
        
        const result = await pool.request()
            .input('id', sql.Int, id)
            .query('SELECT * FROM fun_GetMediaId(@id)');
        
        if (result.recordset.length === 0) return null;
        return this.mapToMedia(result.recordset[0]);
    }

    async create(media: MediaCatalog): Promise<number> {
        const pool = getPool();
        if (!pool) throw new Error('Database not connected');
        
        const result = await pool.request()
            .input('MfileType', sql.VarChar(100), media.FileType)
            .input('MfilePath', sql.VarChar(250), media.FilePath)
            .input('Mdescription', sql.VarChar(50), media.Descripti)
            .query(`
                INSERT INTO tbl_MediaCatalog (FileType, FilePath, Descripti, UploadDate)
                OUTPUT INSERTED.PK_MediaId
                VALUES (@MfileType, @MfilePath, @Mdescription, GETDATE());
            `);
        
        return result.recordset[0];
    }

    async delete(id: number): Promise<boolean> {
        const pool = getPool();
        if (!pool) throw new Error('Database not connected');
        
        const result = await pool.request()
            .input('id', sql.Int, id)
            .query('exec pr_DeleteMedia @MediaId = @id');
        
        return result.rowsAffected[0] > 0;
    }

    private mapToMedia(row: any): MediaCatalog {
        const media = new MediaCatalog();
        media.PK_MediaId = row.PK_MediaId;
        media.FileType = row.FileType;
        media.FilePath = row.FilePath;
        media.Descripti = row.Descripti;
        media.UploadDate = row.UploadDate;
        return media;
    }
}
