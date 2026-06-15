import * as sql from 'mssql';
import { getPool } from '../config/dbConfig';
import Educator from '../entities/educator';

export default class EducatorsRepository {
    async getAll(): Promise<Educator[]> {
        const pool = getPool();
        if (!pool) throw new Error('Database not connected');

        const result = await pool.request()
            .query(`
                SELECT
                    ti.PK_Id,
                    ti.FK_UserId,
                    ti.Teacher_Specialization,
                    u.UserLogin,
                    u.first_name,
                    u.second_name,
                    u.phone,
                    u.email
                FROM tbl_User u
                LEFT JOIN tbl_teacherInfo ti ON ti.FK_UserId = u.PK_UserId
                WHERE u.FK_RoleId = 2
            `);

        return result.recordset.map((row: any) => this.mapToEducator(row));
    }

    async getById(id: number): Promise<Educator | null> {
        const pool = getPool();
        if (!pool) throw new Error('Database not connected');

        const result = await pool.request()
            .input('id', sql.Int, id)
            .query(`
                SELECT
                    ti.PK_Id,
                    ti.FK_UserId,
                    ti.Teacher_Specialization,
                    u.UserLogin,
                    u.first_name,
                    u.second_name,
                    u.phone,
                    u.email
                FROM tbl_User u
                LEFT JOIN tbl_teacherInfo ti ON ti.FK_UserId = u.PK_UserId
                WHERE u.FK_RoleId = 2 AND ti.PK_Id = @id
            `);

        if (result.recordset.length === 0) return null;
        return this.mapToEducator(result.recordset[0]);
    }

    async getByUserId(userId: number): Promise<Educator | null> {
        const pool = getPool();
        if (!pool) throw new Error('Database not connected');

        const result = await pool.request()
            .input('userId', sql.Int, userId)
            .query(`
                SELECT
                    ti.PK_Id,
                    ti.FK_UserId,
                    ti.Teacher_Specialization,
                    u.UserLogin,
                    u.first_name,
                    u.second_name,
                    u.phone,
                    u.email
                FROM tbl_User u
                LEFT JOIN tbl_teacherInfo ti ON ti.FK_UserId = u.PK_UserId
                WHERE u.PK_UserId = @userId AND u.FK_RoleId = 2
            `);

        if (result.recordset.length === 0) return null;
        return this.mapToEducator(result.recordset[0]);
    }

    async create(educator: Educator): Promise<Educator | null> {
        const pool = getPool();
        if (!pool) throw new Error('Database not connected');

        const result = await pool.request()
            .input('userId', sql.Int, educator.FK_UserId)
            .input('specialization', sql.NVarChar(255), educator.Teacher_Specialization || null)
            .query(`
                INSERT INTO tbl_teacherInfo (FK_UserId, Teacher_Specialization)
                VALUES (@userId, @specialization);
                SELECT SCOPE_IDENTITY() AS Id;
            `);

        const newId = result.recordset[0]?.Id;
        if (newId) {
            return this.getById(newId);
        }
        return null;
    }

    async update(id: number, educator: Educator): Promise<boolean> {
        const existing = await this.getById(id);
        if (!existing) return false;

        const pool = getPool();
        if (!pool) throw new Error('Database not connected');

        await pool.request()
            .input('id', sql.Int, id)
            .input('specialization', sql.NVarChar(255), educator.Teacher_Specialization ?? existing.Teacher_Specialization ?? null)
            .query(`
                UPDATE tbl_teacherInfo
                SET Teacher_Specialization = @specialization
                WHERE PK_Id = @id
            `);

        if (educator.User) {
            await pool.request()
                .input('userId', sql.Int, existing.FK_UserId)
                .input('firstName', sql.VarChar(50), educator.User.first_name ?? null)
                .input('secondName', sql.VarChar(50), educator.User.second_name ?? null)
                .input('phone', sql.VarChar(50), educator.User.phone ?? null)
                .input('email', sql.NVarChar(255), educator.User.email ?? null)
                .query(`
                    UPDATE tbl_User
                    SET first_name = COALESCE(@firstName, first_name),
                        second_name = COALESCE(@secondName, second_name),
                        phone = COALESCE(@phone, phone),
                        email = COALESCE(@email, email)
                    WHERE PK_UserId = @userId
                `);
        }

        return true;
    }

    async delete(id: number): Promise<boolean> {
        const pool = getPool();
        if (!pool) throw new Error('Database not connected');

        const result = await pool.request()
            .input('id', sql.Int, id)
            .query('DELETE FROM tbl_teacherInfo WHERE PK_Id = @id');

        return result.rowsAffected[0] > 0;
    }

    private mapToEducator(row: any): Educator {
        const educator = new Educator();
        educator.PK_Id = row.PK_Id;
        educator.FK_UserId = row.FK_UserId;
        educator.Teacher_Specialization = row.Teacher_Specialization;
        if (row.UserLogin) {
            educator.User = {
                PK_UserId: row.FK_UserId,
                UserLogin: row.UserLogin,
                UserPassword: '',
                FK_RoleId: 2,
                first_name: row.first_name,
                second_name: row.second_name,
                phone: row.phone,
                email: row.email
            };
        }
        return educator;
    }
}
