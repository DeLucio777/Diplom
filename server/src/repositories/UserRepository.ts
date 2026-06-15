import * as sql from 'mssql';
import { getPool } from '../config/dbConfig';
import User from '../entities/user';

export default class UserRepository {
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
                    u.first_name,
                    u.second_name,
                    u.phone,
                    u.email,
                    r.RoleName
                FROM tbl_User u
                LEFT JOIN tbl_Roles r ON u.FK_RoleId = r.PK_RoleId
            `);

        return result.recordset.map((row: any) => this.mapToUser(row));
    }

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
                    u.first_name,
                    u.second_name,
                    u.phone,
                    u.email,
                    r.RoleName
                FROM tbl_User u
                LEFT JOIN tbl_Roles r ON u.FK_RoleId = r.PK_RoleId
                WHERE u.PK_UserId = @id
            `);

        if (result.recordset.length === 0) return null;
        return this.mapToUser(result.recordset[0]);
    }

    async findByLogin(login: string): Promise<User | null> {
        const pool = getPool();
        if (!pool) throw new Error('Database not connected');

        const result = await pool.request()
            .input('login', sql.VarChar(50), login)
            .query(`
                SELECT
                    u.PK_UserId,
                    u.UserLogin,
                    u.UserPassword,
                    u.FK_RoleId,
                    u.first_name,
                    u.second_name,
                    u.phone, 
                    u.email,
                    r.RoleName
                FROM tbl_User u
                LEFT JOIN tbl_Roles r ON u.FK_RoleId = r.PK_RoleId
                WHERE u.UserLogin = @login
            `);

        if (result.recordset.length === 0) return null;
        return this.mapToUser(result.recordset[0]);
    }

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
                    u.first_name,
                    u.second_name,
                    u.phone,
                    u.email,
                    r.RoleName
                FROM tbl_User u
                JOIN tbl_Roles r ON u.FK_RoleId = r.PK_RoleId
                WHERE u.UserLogin = @login AND u.UserPassword = @password
            `);

        if (result.recordset.length === 0) return null;
        return this.mapToUser(result.recordset[0]);
    }

    async create(user: User): Promise<User | null> {
        const pool = getPool();
        if (!pool) throw new Error('Database not connected');

        const result = await pool.request()
            .input('login', sql.VarChar(50), user.UserLogin)
            .input('password', sql.VarChar(50), user.UserPassword)
            .input('roleId', sql.Int, user.FK_RoleId)
            .input('firstName', sql.VarChar(50), user.first_name || null)
            .input('secondName', sql.VarChar(50), user.second_name || null)
            .input('phone', sql.VarChar(50), user.phone || null)
            .input('email', sql.NVarChar(255), user.email || null)
            .query(`
                INSERT INTO tbl_User (UserLogin, UserPassword, FK_RoleId, first_name, second_name, phone, email)
                VALUES (@login, @password, @roleId, @firstName, @secondName, @phone, @email);
                SELECT SCOPE_IDENTITY() AS Id;
            `);

        const newId = result.recordset[0]?.Id;
        if (newId) {
            return this.getById(newId);
        }
        return null;
    }

    async update(id: number, user: Partial<User>): Promise<User | null> {
        const existing = await this.getById(id);
        if (!existing) return null;

        const pool = getPool();
        if (!pool) throw new Error('Database not connected');

        await pool.request()
            .input('id', sql.Int, id)
            .input('login', sql.VarChar(50), user.UserLogin ?? existing.UserLogin)
            .input('password', sql.VarChar(50), user.UserPassword ?? existing.UserPassword)
            .input('roleId', sql.Int, user.FK_RoleId ?? existing.FK_RoleId ?? null)
            .input('firstName', sql.VarChar(50), user.first_name ?? existing.first_name ?? null)
            .input('secondName', sql.VarChar(50), user.second_name ?? existing.second_name ?? null)
            .input('phone', sql.VarChar(50), user.phone ?? existing.phone ?? null)
            .input('email', sql.NVarChar(255), user.email ?? existing.email ?? null)
            .query(`
                UPDATE tbl_User
                SET UserLogin = @login,
                    UserPassword = @password,
                    FK_RoleId = @roleId,
                    first_name = @firstName,
                    second_name = @secondName,
                    phone = @phone,
                    email = @email
                WHERE PK_UserId = @id
            `);

        return this.getById(id);
    }

    async delete(id: number): Promise<boolean> {
        const pool = getPool();
        if (!pool) throw new Error('Database not connected');

        try {
            await pool.request()
                .input('userId', sql.Int, id)
                .query(`
                    DELETE FROM tbl_childrent_to_groups WHERE FK_user_id = @userId;
                    DELETE FROM tbl_childInfo WHERE FK_user_id = @userId;
                    DELETE FROM tbl_teacherInfo WHERE FK_UserId = @userId;
                    DELETE FROM tbl_users_achievement WHERE user_id = @userId;
                    DELETE FROM tbl_task_lst_to_data WHERE user_id = @userId;
                `);

            const result = await pool.request()
                .input('id', sql.Int, id)
                .query('DELETE FROM tbl_User WHERE PK_UserId = @id');

            return result.rowsAffected[0] > 0;
        } catch (error) {
            console.error('Failed to delete user:', error);
            return false;
        }
    }

    private mapToUser(row: any): User {
        const user = new User();
        user.PK_UserId = row.PK_UserId;
        user.UserLogin = row.UserLogin;
        user.UserPassword = row.UserPassword;
        user.FK_RoleId = row.FK_RoleId;
        user.first_name = row.first_name;
        user.second_name = row.second_name;
        user.phone = row.phone;
        user.email = row.email;
        if (row.RoleName) {
            user.Role = {
                PK_RoleId: row.FK_RoleId,
                RoleName: row.RoleName
            };
        }
        return user;
    }
}
