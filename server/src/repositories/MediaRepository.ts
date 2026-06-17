import * as sql from 'mssql';
import { getPool } from '../config/dbConfig';
import MediaCatalog from '../entities/mediaCatalog';

export default class MediaRepository {
    async getAll(): Promise<MediaCatalog[]> {
        const pool = getPool();
        if (!pool) throw new Error('Database not connected');

        const result = await pool.request()
            .query('SELECT PK_MediaId, FileType, FilePath, Descripti, UploadDate FROM tbl_MediaCatalog');

        return result.recordset.map((row: any) => this.mapToMedia(row));
    }

    async getById(id: number): Promise<MediaCatalog | null> {
        const pool = getPool();
        if (!pool) throw new Error('Database not connected');

        const result = await pool.request()
            .input('id', sql.Int, id)
            .query('SELECT PK_MediaId, FileType, FilePath, Descripti, UploadDate FROM tbl_MediaCatalog WHERE PK_MediaId = @id');

        if (result.recordset.length === 0) return null;
        return this.mapToMedia(result.recordset[0]);
    }

    async create(media: MediaCatalog): Promise<number> {
        const pool = getPool();
        if (!pool) throw new Error('Database not connected');

        const result = await pool.request()
            .input('fileType', sql.VarChar(100), media.FileType)
            .input('filePath', sql.VarChar(250), media.FilePath)
            .input('description', sql.VarChar(50), media.Descripti || null)
            .query(`
                INSERT INTO tbl_MediaCatalog (FileType, FilePath, Descripti, UploadDate)
                OUTPUT INSERTED.PK_MediaId
                VALUES (@fileType, @filePath, @description, GETDATE());
            `);

        return result.recordset[0]?.PK_MediaId || 0;
    }

    async update(id: number, media: MediaCatalog): Promise<boolean> {
        const pool = getPool();
        if (!pool) throw new Error('Database not connected');

        const result = await pool.request()
            .input('id', sql.Int, id)
            .input('description', sql.VarChar(50), media.Descripti || null)
            .query(`
                UPDATE tbl_MediaCatalog
                SET 
                    Descripti = @description
                WHERE PK_MediaId = @id
            `);

        return result.rowsAffected[0] > 0;
    }

    async delete(id: number): Promise<boolean> {
        const pool = getPool();
        if (!pool) throw new Error('Database not connected');

        const result = await pool.request()
            .input('id', sql.Int, id)
            .query(`
                DELETE FROM tbl_MatchImageWordPairs WHERE FK_MediaId = @id;
                DELETE FROM tbl_users_achievement
                WHERE achivement_id IN (SELECT id FROM tbl_achievement WHERE image_id = @id);
                DELETE FROM tbl_achievement WHERE image_id = @id;
                DELETE FROM tbl_MediaCatalog WHERE PK_MediaId = @id;
            `);

        return result.rowsAffected[result.rowsAffected.length - 1] > 0;
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
