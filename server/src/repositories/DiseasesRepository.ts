import sql from 'mssql';
import { getPool } from '../config/dbConfig';
import Disease from '../entities/disease';

export default class DiseasesRepository {
    
    async getAll(): Promise<Disease[]> {
        const pool = getPool();
        if (!pool) throw new Error('Database not connected');
        
        const result = await pool.request()
            .query('SELECT PK_Id, name FROM tbl_disease');
        
        return result.recordset.map((row: any) => this.mapToDisease(row));
    }

    private mapToDisease(row: any): Disease {
        const disease = new Disease();
        disease.PK_Id = row.PK_Id;
        disease.name = row.name;
        return disease;
    }
}