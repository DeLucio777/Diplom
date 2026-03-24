import sql from 'mssql';
import { getPool } from '../config/dbConfig';
import Role from '../entities/role';

export default class RoleRepository {
    
    async getAll(): Promise<Role[]> {
        const pool = getPool();
        if (!pool) throw new Error('Database not connected');
        
        const result = await pool.request()
            .query('SELECT * FROM vw_GetAllRoles');
        
        return result.recordset.map((row: any) => this.mapToRole(row));
    }

    async getById(id: number): Promise<Role | null> {
        const pool = getPool();
        if (!pool) throw new Error('Database not connected');
        
        const result = await pool.request()
            .input('id', sql.Int, id)
            .query('SELECT * FROM fun_GetRoleById(@id)');
        
        if (result.recordset.length === 0) return null;
        return this.mapToRole(result.recordset[0]);
    }

    private mapToRole(row: any): Role {
        const role = new Role();
        role.PK_RoleId = row.PK_RoleId;
        role.RoleName = row.RoleName;
        return role;
    }
}
