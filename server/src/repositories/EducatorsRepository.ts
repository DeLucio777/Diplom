import sql from 'mssql';
import { getPool } from '../config/dbConfig';
import Educator from '../entities/educator';

export default class EducatorsRepository {
    
    async getAll(): Promise<Educator[]> {
        const pool = getPool();
        if (!pool) throw new Error('Database not connected');
        
        const result = await pool.request()
            .query('SELECT PK_EducatorId, FK_UserId, FullName, Specialization, Phone, Email FROM tbl_Educator');
        
        return result.recordset.map((row: any) => this.mapToEducator(row));
    }

    async getById(id: number): Promise<Educator | null> {
        const pool = getPool();
        if (!pool) throw new Error('Database not connected');
        
        const result = await pool.request()
            .input('id', sql.Int, id)
            .query('SELECT PK_EducatorId, FK_UserId, FullName, Specialization, Phone, Email FROM tbl_Educator WHERE PK_EducatorId = @id');
        
        if (result.recordset.length === 0) return null;
        return this.mapToEducator(result.recordset[0]);
    }

    async getByUserId(userId: number): Promise<Educator | null> {
        const pool = getPool();
        if (!pool) throw new Error('Database not connected');
        
        const result = await pool.request()
            .input('userId', sql.Int, userId)
            .query('SELECT PK_EducatorId, FK_UserId, FullName, Specialization, Phone, Email FROM tbl_Educator WHERE FK_UserId = @userId');
        
        if (result.recordset.length === 0) return null;
        return this.mapToEducator(result.recordset[0]);
    }

    async create(educator: Educator): Promise<Educator | null> {
        const pool = getPool();
        if (!pool) throw new Error('Database not connected');
        
        const result = await pool.request()
            .input('userId', sql.Int, educator.FK_UserId)
            .input('fullName', sql.VarChar(100), educator.FullName)
            .input('specialization', sql.VarChar(100), educator.Specialization)
            .input('phone', sql.VarChar(50), educator.Phone)
            .input('email', sql.VarChar(100), educator.Email)
            .query(`
                INSERT INTO tbl_Educator (FK_UserId, FullName, Specialization, Phone, Email)
                VALUES (@userId, @fullName, @specialization, @phone, @email);
                SELECT SCOPE_IDENTITY() as Id;
            `);
        
        const newId = result.recordset[0]?.Id;
        if (newId) {
            return this.getById(newId);
        }
        return null;
    }

    async update(id: number, educator: Educator): Promise<boolean> {
        const pool = getPool();
        if (!pool) throw new Error('Database not connected');
        
        const result = await pool.request()
            .input('id', sql.Int, id)
            .input('fullName', sql.VarChar(100), educator.FullName)
            .input('specialization', sql.VarChar(100), educator.Specialization)
            .input('phone', sql.VarChar(50), educator.Phone)
            .input('email', sql.VarChar(100), educator.Email)
            .query(`
                UPDATE tbl_Educator 
                SET FullName = @fullName, 
                    Specialization = @specialization, 
                    Phone = @phone,
                    Email = @email
                WHERE PK_EducatorId = @id
            `);
        
        return result.rowsAffected[0] > 0;
    }

    async delete(id: number): Promise<boolean> {
        const pool = getPool();
        if (!pool) throw new Error('Database not connected');
        
        const result = await pool.request()
            .input('id', sql.Int, id)
            .query('DELETE FROM tbl_Educator WHERE PK_EducatorId = @id');
        
        return result.rowsAffected[0] > 0;
    }

    private mapToEducator(row: any): Educator {
        const educator = new Educator();
        educator.PK_EducatorId = row.PK_EducatorId;
        educator.FK_UserId = row.FK_UserId;
        educator.FullName = row.FullName;
        educator.Specialization = row.Specialization;
        educator.Phone = row.Phone;
        educator.Email = row.Email;
        return educator;
    }
}