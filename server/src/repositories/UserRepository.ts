import sql from 'mssql';
import { getPool } from '../config/dbConfig';
import User from '../entities/user';

export default class UserRepository {
    
    // GET all users
    async getAll(): Promise<User[]> {
        const pool = getPool();
        if (!pool) throw new Error('Database not connected');
        
        const result = await pool.request()
            .query(`
                SELECT 
                    u.PK_UserId,
                    u.UserLogin,
                    u.UserPassword,
                    u.FK_RoleId,
                    r.RoleName
                FROM tbl_User u
                LEFT JOIN tbl_Roles r ON u.FK_RoleId = r.PK_RoleId
            `);
        
        return result.recordset.map((row: any) => this.mapToUser(row));
    }

    // GET user by ID
    async getById(id: number): Promise<User | null> {
        const pool = getPool();
        if (!pool) throw new Error('Database not connected');
        
        const result = await pool.request()
            .input('id', sql.Int, id)
            .query(`
                SELECT 
                    u.PK_UserId,
                    u.UserLogin,
                    u.UserPassword,
                    u.FK_RoleId,
                    r.RoleName
                FROM tbl_User u
                LEFT JOIN tbl_Roles r ON u.FK_RoleId = r.PK_RoleId
                WHERE u.PK_UserId = @id
            `);
        
        if (result.recordset.length === 0) return null;
        return this.mapToUser(result.recordset[0]);
    }

    // LOGIN - Find user by login and password
    async login(login: string, password: string): Promise<User | null> {
        const pool = getPool();
        if (!pool) throw new Error('Database not connected');
        
        const result = await pool.request()
            .input('login', sql.VarChar(50), login)
            .input('password', sql.VarChar(50), password)
            .query(`
                SELECT 
                    u.PK_UserId,
                    u.UserLogin,
                    u.UserPassword,
                    u.FK_RoleId,
                    r.RoleName
                FROM tbl_User u
                LEFT JOIN tbl_Roles r ON u.FK_RoleId = r.PK_RoleId
                WHERE u.UserLogin = @login AND u.UserPassword = @password
            `);
        
        if (result.recordset.length === 0) return null;
        return this.mapToUser(result.recordset[0]);
    }

    // CREATE new user
    async create(user: User): Promise<number> {
        const pool = getPool();
        if (!pool) throw new Error('Database not connected');
        
        const result = await pool.request()
            .input('login', sql.VarChar(50), user.UserLogin)
            .input('password', sql.VarChar(50), user.UserPassword)
            .input('roleId', sql.Int, user.FK_RoleId)
            .query(`
                INSERT INTO tbl_User (UserLogin, UserPassword, FK_RoleId)
                VALUES (@login, @password, @roleId);
                SELECT SCOPE_IDENTITY() as Id;
            `);
        
        return result.recordset[0].Id;
    }

    // Helper method to map database row to User entity
    private mapToUser(row: any): User {
        const user = new User();
        user.PK_UserId = row.PK_UserId;
        user.UserLogin = row.UserLogin;
        user.UserPassword = row.UserPassword;
        user.FK_RoleId = row.FK_RoleId;
        if (row.RoleName) {
            user.Role = {
                PK_RoleId: row.FK_RoleId,
                RoleName: row.RoleName
            };
        }
        return user;
    }
}
