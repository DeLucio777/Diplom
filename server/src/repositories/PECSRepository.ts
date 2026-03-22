import sql from 'mssql';
import { getPool } from '../config/dbConfig';
import CatalogPECS from '../entities/catalogPECS';

export default class PECSRepository {
    
    // GET all PECS items
    async getAll(): Promise<CatalogPECS[]> {
        const pool = getPool();
        if (!pool) throw new Error('Database not connected');
        
        const result = await pool.request()
            .query('SELECT PK_PECSid, Descripti, filePath, Category, UploadDate FROM tbl_CatalogPECS');
        
        return result.recordset.map((row: any) => this.mapToPECS(row));
    }

    // GET PECS by ID
    async getById(id: number): Promise<CatalogPECS | null> {
        const pool = getPool();
        if (!pool) throw new Error('Database not connected');
        
        const result = await pool.request()
            .input('id', sql.Int, id)
            .query('SELECT PK_PECSid, Descripti, filePath, Category, UploadDate FROM tbl_CatalogPECS WHERE PK_PECSid = @id');
        
        if (result.recordset.length === 0) return null;
        return this.mapToPECS(result.recordset[0]);
    }

    // CREATE new PECS
    async create(pecs: CatalogPECS): Promise<number> {
        const pool = getPool();
        if (!pool) throw new Error('Database not connected');
        
        const result = await pool.request()
            .input('description', sql.VarChar(50), pecs.Descripti)
            .input('filePath', sql.VarChar(250), pecs.filePath)
            .input('category', sql.VarChar(50), pecs.Category)
            .query(`
                INSERT INTO tbl_CatalogPECS (Descripti, filePath, Category, UploadDate)
                VALUES (@description, @filePath, @category, GETDATE());
                SELECT SCOPE_IDENTITY() as Id;
            `);
        
        return result.recordset[0].Id;
    }

    // DELETE PECS
    async delete(id: number): Promise<boolean> {
        const pool = getPool();
        if (!pool) throw new Error('Database not connected');
        
        const result = await pool.request()
            .input('id', sql.Int, id)
            .query('DELETE FROM tbl_CatalogPECS WHERE PK_PECSid = @id');
        
        return result.rowsAffected[0] > 0;
    }

    // Helper method to map database row to CatalogPECS entity
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
