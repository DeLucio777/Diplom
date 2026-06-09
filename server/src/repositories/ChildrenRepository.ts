import * as sql from 'mssql';
import { getPool } from '../config/dbConfig';
import Child from '../entities/child';

export default class ChildrenRepository {
    
    async getAll(): Promise<Child[]> {
        const pool = getPool();
        if (!pool) throw new Error('Database not connected');
        
        const result = await pool.request()
            .query('SELECT PK_ChildId, FullName, BirthDate, PerceptionFeatures, SpeechLevel, FK_RepresentativeId, FK_EducatorId, RegisteredDate FROM tbl_Child');
        
        return result.recordset.map((row: any) => this.mapToChild(row));
    }

    async getById(id: number): Promise<Child | null> {
        const pool = getPool();
        if (!pool) throw new Error('Database not connected');
        
        const result = await pool.request()
            .input('id', sql.Int, id)
            .query('SELECT PK_ChildId, FullName, BirthDate, PerceptionFeatures, SpeechLevel, FK_RepresentativeId, FK_EducatorId, RegisteredDate FROM tbl_Child WHERE PK_ChildId = @id');
        
        if (result.recordset.length === 0) return null;
        return this.mapToChild(result.recordset[0]);
    }

    async getByEducator(educatorId: number): Promise<Child[]> {
        const pool = getPool();
        if (!pool) throw new Error('Database not connected');
        
        const result = await pool.request()
            .input('educatorId', sql.Int, educatorId)
            .query('SELECT PK_ChildId, FullName, BirthDate, PerceptionFeatures, SpeechLevel, FK_RepresentativeId, FK_EducatorId, RegisteredDate FROM tbl_Child WHERE FK_EducatorId = @educatorId');
        
        return result.recordset.map((row: any) => this.mapToChild(row));
    }

    async getByRepresentative(repId: number): Promise<Child[]> {
        const pool = getPool();
        if (!pool) throw new Error('Database not connected');
        
        const result = await pool.request()
            .input('repId', sql.Int, repId)
            .query('SELECT PK_ChildId, FullName, BirthDate, PerceptionFeatures, SpeechLevel, FK_RepresentativeId, FK_EducatorId, RegisteredDate FROM tbl_Child WHERE FK_RepresentativeId = @repId');
        
        return result.recordset.map((row: any) => this.mapToChild(row));
    }

    async create(child: Child): Promise<Child | null> {
        const pool = getPool();
        if (!pool) throw new Error('Database not connected');
        
        const result = await pool.request()
            .input('fullName', sql.VarChar(100), child.FullName)
            .input('birthDate', sql.Date, child.BirthDate)
            .input('perceptionFeatures', sql.VarChar(255), child.PerceptionFeatures)
            .input('speechLevel', sql.VarChar(50), child.SpeechLevel)
            .input('representativeId', sql.Int, child.FK_RepresentativeId)
            .input('educatorId', sql.Int, child.FK_EducatorId)
            .query(`
                INSERT INTO tbl_Child (FullName, BirthDate, PerceptionFeatures, SpeechLevel, FK_RepresentativeId, FK_EducatorId, RegisteredDate)
                VALUES (@fullName, @birthDate, @perceptionFeatures, @speechLevel, @representativeId, @educatorId, GETDATE());
                SELECT SCOPE_IDENTITY() as Id;
            `);
        
        const newId = result.recordset[0]?.Id;
        if (newId) {
            return this.getById(newId);
        }
        return null;
    }

    async update(id: number, child: Child): Promise<boolean> {
        const pool = getPool();
        if (!pool) throw new Error('Database not connected');
        
        const result = await pool.request()
            .input('id', sql.Int, id)
            .input('fullName', sql.VarChar(100), child.FullName)
            .input('birthDate', sql.Date, child.BirthDate)
            .input('perceptionFeatures', sql.VarChar(255), child.PerceptionFeatures)
            .input('speechLevel', sql.VarChar(50), child.SpeechLevel)
            .input('representativeId', sql.Int, child.FK_RepresentativeId)
            .input('educatorId', sql.Int, child.FK_EducatorId)
            .query(`
                UPDATE tbl_Child 
                SET FullName = @fullName, 
                    BirthDate = @birthDate, 
                    PerceptionFeatures = @perceptionFeatures,
                    SpeechLevel = @speechLevel,
                    FK_RepresentativeId = @representativeId,
                    FK_EducatorId = @educatorId
                WHERE PK_ChildId = @id
            `);
        
        return result.rowsAffected[0] > 0;
    }

    async delete(id: number): Promise<boolean> {
        const pool = getPool();
        if (!pool) throw new Error('Database not connected');
        
        const result = await pool.request()
            .input('id', sql.Int, id)
            .query('DELETE FROM tbl_Child WHERE PK_ChildId = @id');
        
        return result.rowsAffected[0] > 0;
    }

    private mapToChild(row: any): Child {
        const child = new Child();
        child.PK_ChildId = row.PK_ChildId;
        child.FullName = row.FullName;
        child.BirthDate = row.BirthDate;
        child.PerceptionFeatures = row.PerceptionFeatures;
        child.SpeechLevel = row.SpeechLevel;
        child.FK_RepresentativeId = row.FK_RepresentativeId;
        child.FK_EducatorId = row.FK_EducatorId;
        child.RegisteredDate = row.RegisteredDate;
        return child;
    }
}