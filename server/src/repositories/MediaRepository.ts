import sql from 'mssql';
import { getPool } from '../config/dbConfig';
import MediaCatalog from '../entities/mediaCatalog';

export default class MediaRepository {
    
    // GET all media items
    async getAll(): Promise<MediaCatalog[]> {
        const pool = getPool();
        if (!pool) throw new Error('Database not connected');
        
        const result = await pool.request()
            .query('SELECT PK_MediaId, FileType, FilePath, Descripti, UploadDate FROM tbl_MediaCatalog');
        
        return result.recordset.map((row: any) => this.mapToMedia(row));
    }

    // GET media by ID
    async getById(id: number): Promise<MediaCatalog | null> {
        const pool = getPool();
        if (!pool) throw new Error('Database not connected');
        
        const result = await pool.request()
            .input('id', sql.Int, id)
            .query('SELECT PK_MediaId, FileType, FilePath, Descripti, UploadDate FROM tbl_MediaCatalog WHERE PK_MediaId = @id');
        
        if (result.recordset.length === 0) return null;
        return this.mapToMedia(result.recordset[0]);
    }

    // CREATE new media
    async create(media: MediaCatalog): Promise<number> {
        const pool = getPool();
        if (!pool) throw new Error('Database not connected');
        
        const result = await pool.request()
            .input('fileType', sql.VarChar(100), media.FileType)
            .input('filePath', sql.VarChar(250), media.FilePath)
            .input('description', sql.VarChar(50), media.Descripti)
            .query(`
                INSERT INTO tbl_MediaCatalog (FileType, FilePath, Descripti, UploadDate)
                VALUES (@fileType, @filePath, @description, GETDATE());
                SELECT SCOPE_IDENTITY() as Id;
            `);
        
        return result.recordset[0].Id;
    }

    // DELETE media
    async delete(id: number): Promise<boolean> {
        const pool = getPool();
        if (!pool) throw new Error('Database not connected');
        
        const result = await pool.request()
            .input('id', sql.Int, id)
            .query('DELETE FROM tbl_MediaCatalog WHERE PK_MediaId = @id');
        
        return result.rowsAffected[0] > 0;
    }

    // Helper method to map database row to MediaCatalog entity
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
