import sql from 'mssql';
import { getPool } from '../config/dbConfig';
import LegalRepresentative from '../entities/legalRepresentative';

export default class RepresentativesRepository {
    
    async getAll(): Promise<LegalRepresentative[]> {
        const pool = getPool();
        if (!pool) throw new Error('Database not connected');
        
        const result = await pool.request()
            .query('SELECT PK_RepresentativeId, FK_UserId, FullName, RelationType, Phone, Email FROM tbl_LegalRepresentative');
        
        return result.recordset.map((row: any) => this.mapToRepresentative(row));
    }

    async getByUserId(userId: number): Promise<LegalRepresentative | null> {
        const pool = getPool();
        if (!pool) throw new Error('Database not connected');
        
        const result = await pool.request()
            .input('userId', sql.Int, userId)
            .query('SELECT PK_RepresentativeId, FK_UserId, FullName, RelationType, Phone, Email FROM tbl_LegalRepresentative WHERE FK_UserId = @userId');
        
        if (result.recordset.length === 0) return null;
        return this.mapToRepresentative(result.recordset[0]);
    }

    async create(rep: LegalRepresentative): Promise<LegalRepresentative | null> {
        const pool = getPool();
        if (!pool) throw new Error('Database not connected');
        
        const result = await pool.request()
            .input('userId', sql.Int, rep.FK_UserId)
            .input('fullName', sql.VarChar(100), rep.FullName)
            .input('relationType', sql.VarChar(50), rep.RelationType)
            .input('phone', sql.VarChar(50), rep.Phone)
            .input('email', sql.VarChar(100), rep.Email)
            .query(`
                INSERT INTO tbl_LegalRepresentative (FK_UserId, FullName, RelationType, Phone, Email)
                VALUES (@userId, @fullName, @relationType, @phone, @email);
                SELECT SCOPE_IDENTITY() as Id;
            `);
        
        const newId = result.recordset[0]?.Id;
        if (newId) {
            return this.getById(newId);
        }
        return null;
    }

    async getById(id: number): Promise<LegalRepresentative | null> {
        const pool = getPool();
        if (!pool) throw new Error('Database not connected');
        
        const result = await pool.request()
            .input('id', sql.Int, id)
            .query('SELECT PK_RepresentativeId, FK_UserId, FullName, RelationType, Phone, Email FROM tbl_LegalRepresentative WHERE PK_RepresentativeId = @id');
        
        if (result.recordset.length === 0) return null;
        return this.mapToRepresentative(result.recordset[0]);
    }

    async delete(id: number): Promise<boolean> {
        const pool = getPool();
        if (!pool) throw new Error('Database not connected');
        
        const result = await pool.request()
            .input('id', sql.Int, id)
            .query('DELETE FROM tbl_LegalRepresentative WHERE PK_RepresentativeId = @id');
        
        return result.rowsAffected[0] > 0;
    }

    private mapToRepresentative(row: any): LegalRepresentative {
        const rep = new LegalRepresentative();
        rep.PK_RepresentativeId = row.PK_RepresentativeId;
        rep.FK_UserId = row.FK_UserId;
        rep.FullName = row.FullName;
        rep.RelationType = row.RelationType;
        rep.Phone = row.Phone;
        rep.Email = row.Email;
        return rep;
    }
}