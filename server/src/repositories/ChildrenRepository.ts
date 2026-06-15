import * as sql from 'mssql';
import { getPool } from '../config/dbConfig';
import Child from '../entities/child';
import UserInfo from '../entities/userInfo';

const PARENT_ROLE_ID = 1;

export default class ChildrenRepository {
    async getAll(): Promise<Child[]> {
        const pool = getPool();
        if (!pool) throw new Error('Database not connected');

        const result = await pool.request()
            .query(this.childInfoSelect(''));

        return result.recordset.map((row: any) => this.mapToChild(row));
    }

    async getById(id: number): Promise<Child | null> {
        const pool = getPool();
        if (!pool) throw new Error('Database not connected');

        const result = await pool.request()
            .input('id', sql.Int, id)
            .query(this.childInfoSelect(`WHERE u.PK_UserId = @id`));

        if (result.recordset.length === 0) return null;
        return this.mapToChild(result.recordset[0]);
    }

    async getByEducator(educatorId: number): Promise<Child[]> {
        const pool = getPool();
        if (!pool) throw new Error('Database not connected');

        const result = await pool.request()
            .input('educatorId', sql.Int, educatorId)
            .query(`
                ${this.childInfoSelect('')}
                JOIN tbl_group g ON g.FK_Teacher_id = @educatorId
                JOIN tbl_childrent_to_groups ctg ON ctg.FK_group_id = g.PK_Id AND ctg.FK_user_id = u.PK_UserId
            `);

        return result.recordset.map((row: any) => this.mapToChild(row));
    }

    async create(child: Child): Promise<Child | null> {
        const pool = getPool();
        if (!pool) throw new Error('Database not connected');

        const userLogin = child.UserLogin || `${child.first_name || 'child'}_${Date.now()}`;
        const userPassword = child.UserPassword || child.UserLogin || '1';

        const userResult = await pool.request()
            .input('login', sql.VarChar(50), userLogin)
            .input('password', sql.VarChar(50), userPassword)
            .input('roleId', sql.Int, child.FK_RoleId || PARENT_ROLE_ID)
            .input('firstName', sql.VarChar(50), child.first_name || null)
            .input('secondName', sql.VarChar(50), child.second_name || null)
            .input('phone', sql.VarChar(50), child.phone || null)
            .input('email', sql.NVarChar(255), child.email || null)
            .query(`
                INSERT INTO tbl_User (UserLogin, UserPassword, FK_RoleId, first_name, second_name, phone, email)
                VALUES (@login, @password, @roleId, @firstName, @secondName, @phone, @email);
                SELECT SCOPE_IDENTITY() AS UserId;
            `);

        const userId = userResult.recordset[0]?.UserId;
        if (!userId) return null;

        const childInfo: UserInfo = child.ChildInfo || new UserInfo();
        await pool.request()
            .input('userId', sql.Int, userId)
            .input('diseaseId', sql.Int, childInfo.FK_disease_id ?? null)
            .input('completedTasksCount', sql.Int, childInfo.complited_tasks_count ?? null)
            .input('helpsUsedCount', sql.Int, childInfo.helpe_used_count ?? null)
            .input('missTasksCount', sql.Int, childInfo.miss_tasks_count ?? null)
            .input('age', sql.Int, childInfo.age ?? null)
            .input('speakLevel', sql.NVarChar(100), childInfo.speak_level ?? null)
            .query(`
                INSERT INTO tbl_childInfo
                    (FK_user_id, FK_disease_id, complited_tasks_count, helpe_used_count, miss_tasks_count, age, speak_level)
                VALUES
                    (@userId, @diseaseId, @completedTasksCount, @helpsUsedCount, @missTasksCount, @age, @speakLevel);
            `);

        return this.getById(userId);
    }

    async update(id: number, child: Child): Promise<boolean> {
        const pool = getPool();
        if (!pool) throw new Error('Database not connected');

        const userResult = await pool.request()
            .input('id', sql.Int, id)
            .input('login', sql.VarChar(50), child.UserLogin || null)
            .input('password', sql.VarChar(50), child.UserPassword || null)
            .input('roleId', sql.Int, child.FK_RoleId || PARENT_ROLE_ID)
            .input('firstName', sql.VarChar(50), child.first_name ?? null)
            .input('secondName', sql.VarChar(50), child.second_name ?? null)
            .input('phone', sql.VarChar(50), child.phone ?? null)
            .input('email', sql.NVarChar(255), child.email ?? null)
            .query(`
                UPDATE tbl_User
                SET UserLogin = COALESCE(@login, UserLogin),
                    UserPassword = COALESCE(@password, UserPassword),
                    FK_RoleId = @roleId,
                    first_name = COALESCE(@firstName, first_name),
                    second_name = COALESCE(@secondName, second_name),
                    phone = COALESCE(@phone, phone),
                    email = COALESCE(@email, email)
                WHERE PK_UserId = @id AND FK_RoleId = ${PARENT_ROLE_ID}
            `);

        if (userResult.rowsAffected[0] === 0) return false;

        const childInfo: UserInfo = child.ChildInfo || new UserInfo();
        const existingInfo = await this.getChildInfo(id);
        if (existingInfo) {
            await pool.request()
                .input('id', sql.Int, existingInfo.PK_Id)
                .input('diseaseId', sql.Int, childInfo.FK_disease_id ?? existingInfo.FK_disease_id ?? null)
                .input('completedTasksCount', sql.Int, childInfo.complited_tasks_count ?? existingInfo.complited_tasks_count ?? null)
                .input('helpsUsedCount', sql.Int, childInfo.helpe_used_count ?? existingInfo.helpe_used_count ?? null)
                .input('missTasksCount', sql.Int, childInfo.miss_tasks_count ?? existingInfo.miss_tasks_count ?? null)
                .input('age', sql.Int, childInfo.age ?? existingInfo.age ?? null)
                .input('speakLevel', sql.NVarChar(100), childInfo.speak_level ?? existingInfo.speak_level ?? null)
                .query(`
                    UPDATE tbl_childInfo
                    SET FK_disease_id = @diseaseId,
                        complited_tasks_count = @completedTasksCount,
                        helpe_used_count = @helpsUsedCount,
                        miss_tasks_count = @missTasksCount,
                        age = @age,
                        speak_level = @speakLevel
                    WHERE PK_Id = @id
                `);
        } else {
            await pool.request()
                .input('userId', sql.Int, id)
                .input('diseaseId', sql.Int, childInfo.FK_disease_id ?? null)
                .input('completedTasksCount', sql.Int, childInfo.complited_tasks_count ?? null)
                .input('helpsUsedCount', sql.Int, childInfo.helpe_used_count ?? null)
                .input('missTasksCount', sql.Int, childInfo.miss_tasks_count ?? null)
                .input('age', sql.Int, childInfo.age ?? null)
                .input('speakLevel', sql.NVarChar(100), childInfo.speak_level ?? null)
                .query(`
                    INSERT INTO tbl_childInfo
                        (FK_user_id, FK_disease_id, complited_tasks_count, helpe_used_count, miss_tasks_count, age, speak_level)
                    VALUES
                        (@userId, @diseaseId, @completedTasksCount, @helpsUsedCount, @missTasksCount, @age, @speakLevel);
                `);
        }

        return true;
    }

    async delete(id: number): Promise<boolean> {
        const pool = getPool();
        if (!pool) throw new Error('Database not connected');

        await pool.request()
            .input('userId', sql.Int, id)
            .query('DELETE FROM tbl_childrent_to_groups WHERE FK_user_id = @userId');

        await pool.request()
            .input('userId', sql.Int, id)
            .query('DELETE FROM tbl_childInfo WHERE FK_user_id = @userId');

        const result = await pool.request()
            .input('id', sql.Int, id)
            .query(`DELETE FROM tbl_User WHERE PK_UserId = @id AND FK_RoleId = ${PARENT_ROLE_ID}`);

        return result.rowsAffected[0] > 0;
    }

    private async getChildInfo(userId: number): Promise<UserInfo | null> {
        const pool = getPool();
        if (!pool) throw new Error('Database not connected');

        const result = await pool.request()
            .input('userId', sql.Int, userId)
            .query(`
                SELECT PK_Id, FK_user_id, FK_disease_id, complited_tasks_count,
                       helpe_used_count, miss_tasks_count, age, speak_level
                FROM tbl_childInfo
                WHERE FK_user_id = @userId
            `);

        if (result.recordset.length === 0) return null;
        return this.mapToUserInfo(result.recordset[0]);
    }

    private childInfoSelect(whereClause: string): string {
        return `
            SELECT
                u.PK_UserId,
                u.UserLogin,
                u.UserPassword,
                u.FK_RoleId,
                u.first_name,
                u.second_name,
                u.phone,
                u.email,
                ci.PK_Id AS ChildInfo_PK_Id,
                ci.FK_user_id AS ChildInfo_FK_user_id,
                ci.FK_disease_id AS ChildInfo_FK_disease_id,
                ci.complited_tasks_count AS ChildInfo_complited_tasks_count,
                ci.helpe_used_count AS ChildInfo_helpe_used_count,
                ci.miss_tasks_count AS ChildInfo_miss_tasks_count,
                ci.age AS ChildInfo_age,
                ci.speak_level AS ChildInfo_speak_level
            FROM tbl_User u
            LEFT JOIN tbl_childInfo ci ON ci.FK_user_id = u.PK_UserId
            ${whereClause}
        `;
    }

    private mapToChild(row: any): Child {
        const child = new Child();
        child.PK_UserId = row.PK_UserId;
        child.UserLogin = row.UserLogin;
        child.UserPassword = row.UserPassword;
        child.FK_RoleId = row.FK_RoleId;
        child.first_name = row.first_name;
        child.second_name = row.second_name;
        child.phone = row.phone;
        child.email = row.email;

        if (row.ChildInfo_PK_Id) {
            child.ChildInfo = this.mapToUserInfo(row);
        }

        return child;
    }

    private mapToUserInfo(row: any): UserInfo {
        const info = new UserInfo();
        info.PK_Id = row.ChildInfo_PK_Id;
        info.FK_user_id = row.ChildInfo_FK_user_id;
        info.FK_disease_id = row.ChildInfo_FK_disease_id;
        info.complited_tasks_count = row.ChildInfo_complited_tasks_count;
        info.helpe_used_count = row.ChildInfo_helpe_used_count;
        info.miss_tasks_count = row.ChildInfo_miss_tasks_count;
        info.age = row.ChildInfo_age;
        info.speak_level = row.ChildInfo_speak_level;
        return info;
    }
}
