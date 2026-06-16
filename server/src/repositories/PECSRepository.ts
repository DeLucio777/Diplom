import * as sql from 'mssql';
import { getPool } from '../config/dbConfig';
import CatalogPECS from '../entities/catalogPECS';

export default class PECSRepository {
    
    async getAll(): Promise<CatalogPECS[]> {
        const pool = getPool();
        if (!pool) throw new Error('Database not connected');
        
        const result = await pool.request()
            .query('SELECT PK_PECSid, Descripti, filePath, Category, UploadDate FROM tbl_CatalogPECS');
        
        return result.recordset.map((row: any) => this.mapToPECS(row));
    }

    async getById(id: number): Promise<CatalogPECS | null> {
        const pool = getPool();
        if (!pool) throw new Error('Database not connected');
        
        const result = await pool.request()
            .input('id', sql.Int, id)
            .query('SELECT PK_PECSid, Descripti, filePath, Category, UploadDate FROM tbl_CatalogPECS WHERE PK_PECSid = @id');
        
        if (result.recordset.length === 0) return null;
        return this.mapToPECS(result.recordset[0]);
    }

    async create(pecs: CatalogPECS): Promise<number> {
        const pool = getPool();
        if (!pool) throw new Error('Database not connected');
        
        const result = await pool.request()
            .input('description', sql.VarChar(50), pecs.Descripti || null)
            .input('filePath', sql.VarChar(250), pecs.filePath)
            .input('category', sql.VarChar(50), pecs.Category)
            .query(`
                INSERT INTO tbl_CatalogPECS (Descripti, filePath, Category, UploadDate)
                OUTPUT INSERTED.PK_PECSid
                VALUES (@description, @filePath, @category, GETDATE());
            `);
        
        return result.recordset[0]?.PK_PECSid || 0;
    }

    async update(id: number, pecs: CatalogPECS): Promise<boolean> {
        const pool = getPool();
        if (!pool) throw new Error('Database not connected');
        
        const result = await pool.request()
            .input('id', sql.Int, id)
            .input('description', sql.VarChar(50), pecs.Descripti || null)
            .input('filePath', sql.VarChar(250), pecs.filePath)
            .input('category', sql.VarChar(50), pecs.Category)
            .query(`
                UPDATE tbl_CatalogPECS
                SET Descripti = @description,
                    filePath = @filePath,
                    Category = @category
                WHERE PK_PECSid = @id
            `);
        
        return result.rowsAffected[0] > 0;
    }

    async delete(id: number): Promise<boolean> {
        const pool = getPool();
        if (!pool) throw new Error('Database not connected');
        
        const result = await pool.request()
            .input('id', sql.Int, id)
            .query(`
                DELETE FROM tbl_FindOddOneOutItems WHERE FK_pecsId = @id;
                DELETE FROM tbl_MatchImageWordPairs WHERE FK_pecsId = @id;
                DELETE FROM tbl_SequenceItems WHERE FK_pecsId = @id;
                DELETE FROM tbl_SortItems WHERE FK_pecsId = @id;
                DELETE FROM tbl_CatalogPECS WHERE PK_PECSid = @id;
            `);
        
        return result.rowsAffected[result.rowsAffected.length - 1] > 0;
    }

    private mapToPECS(row: any): CatalogPECS {
        const pecs = new CatalogPECS();
        pecs.PK_PECSid = row.PK_PECSid;
        pecs.Descripti = row.Descripti;
        pecs.filePath = row.filePath;
        pecs.Category = row.Category;
        pecs.UploadDate = row.UploadDate;
        return pecs;
    }
}
