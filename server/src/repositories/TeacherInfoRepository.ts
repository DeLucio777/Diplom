import * as sql from 'mssql';
import { getPool } from '../config/dbConfig';
import TeacherInfo from '../entities/teacherInfo';

export default class TeacherInfoRepository {
    async getAll(): Promise<TeacherInfo[]> {
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
                FROM tbl_teacherInfo ti
                JOIN tbl_User u ON u.PK_UserId = ti.FK_UserId
            `);

        return result.recordset.map((row: any) => this.mapToTeacherInfo(row));
    }

    async getByUserId(userId: number): Promise<TeacherInfo | null> {
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
                FROM tbl_teacherInfo ti
                JOIN tbl_User u ON u.PK_UserId = ti.FK_UserId
                WHERE ti.FK_UserId = @userId
            `);

        if (result.recordset.length === 0) return null;
        return this.mapToTeacherInfo(result.recordset[0]);
    }

    async save(userId: number, data: Partial<TeacherInfo>): Promise<TeacherInfo | null> {
        const pool = getPool();
        if (!pool) throw new Error('Database not connected');

        const existing = await this.getByUserId(userId);

        if (existing) {
            await pool.request()
                .input('id', sql.Int, existing.PK_Id)
                .input('specialization', sql.NVarChar(255), data.Teacher_Specialization ?? existing.Teacher_Specialization ?? null)
                .query(`
                    UPDATE tbl_teacherInfo
                    SET Teacher_Specialization = @specialization
                    WHERE PK_Id = @id
                `);
        } else {
            await pool.request()
                .input('userId', sql.Int, userId)
                .input('specialization', sql.NVarChar(255), data.Teacher_Specialization ?? null)
                .query(`
                    INSERT INTO tbl_teacherInfo (FK_UserId, Teacher_Specialization)
                    VALUES (@userId, @specialization);
                    SELECT SCOPE_IDENTITY() AS Id;
                `);
        }

        const payload = data as any;
        if (payload.User || payload.FullName || payload.Phone !== undefined || payload.Email !== undefined) {
            const user = payload.User || {};
            const existingUser = existing?.User;
            let firstName = user.first_name ?? existingUser?.first_name;
            let secondName = user.second_name ?? existingUser?.second_name;
            const phone = payload.Phone ?? user.phone ?? existingUser?.phone;
            const email = payload.Email ?? user.email ?? existingUser?.email;

            if (payload.FullName) {
                const [first_name, second_name] = payload.FullName.split(' ');
                firstName = first_name;
                secondName = second_name || null;
            }

            await pool.request()
                .input('userId', sql.Int, userId)
                .input('firstName', sql.VarChar(50), firstName ?? null)
                .input('secondName', sql.VarChar(50), secondName ?? null)
                .input('phone', sql.VarChar(50), phone ?? null)
                .input('email', sql.NVarChar(255), email ?? null)
                .query(`
                    UPDATE tbl_User
                    SET first_name = COALESCE(@firstName, first_name),
                        second_name = COALESCE(@secondName, second_name),
                        phone = COALESCE(@phone, phone),
                        email = COALESCE(@email, email)
                    WHERE PK_UserId = @userId
                `);
        }

        return this.getByUserId(userId);
    }

    private mapToTeacherInfo(row: any): TeacherInfo {
        const teacherInfo = new TeacherInfo();
        teacherInfo.PK_Id = row.PK_Id;
        teacherInfo.FK_UserId = row.FK_UserId;
        teacherInfo.Teacher_Specialization = row.Teacher_Specialization;
        teacherInfo.User = {
            PK_UserId: row.FK_UserId,
            UserLogin: row.UserLogin,
            UserPassword: '',
            FK_RoleId: 2,
            first_name: row.first_name,
            second_name: row.second_name,
            phone: row.phone,
            email: row.email
        };
        return teacherInfo;
    }
}
