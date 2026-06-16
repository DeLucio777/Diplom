import * as sql from 'mssql';
import { getPool } from '../config/dbConfig';
import Group from '../entities/group';
import ChildGroupMember from '../entities/childrentToGroups';
import Child from '../entities/child';

export default class GroupsRepository {
    async getAll(): Promise<Group[]> {
        const pool = getPool();
        if (!pool) throw new Error('Database not connected');

        const result = await pool.request()
            .query('SELECT * FROM tbl_group');

        return result.recordset.map((row: any) => this.mapToGroup(row));
    }

    async getByEducator(educatorId: number): Promise<Group[]> {
        const pool = getPool();
        if (!pool) throw new Error('Database not connected');

        const result = await pool.request()
            .input('educatorId', sql.Int, educatorId)
            .query('SELECT * FROM tbl_group WHERE FK_Teacher_id = @educatorId');

        return result.recordset.map((row: any) => this.mapToGroup(row));
    }

    async getMembers(groupId: number): Promise<Child[]> {
        const pool = getPool();
        if (!pool) throw new Error('Database not connected');

        const result = await pool.request()
            .input('groupId', sql.Int, groupId)
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
                    ci.PK_Id AS ChildInfo_PK_Id,
                    ci.FK_user_id AS ChildInfo_FK_user_id,
                    ci.FK_disease_id AS ChildInfo_FK_disease_id,
                    ci.complited_tasks_count AS ChildInfo_complited_tasks_count,
                    ci.helpe_used_count AS ChildInfo_helpe_used_count,
                    ci.miss_tasks_count AS ChildInfo_miss_tasks_count,
                    ci.age AS ChildInfo_age,
                    ci.speak_level AS ChildInfo_speak_level
                FROM tbl_childrent_to_groups ctg
                JOIN tbl_User u ON u.PK_UserId = ctg.FK_user_id
                LEFT JOIN tbl_childInfo ci ON ci.FK_user_id = u.PK_UserId
                WHERE ctg.FK_group_id = @groupId
            `);

        return result.recordset.map((row: any) => this.mapToChild(row));
    }

    async getAllMembers(): Promise<ChildGroupMember[]> {
        const pool = getPool();
        if (!pool) throw new Error('Database not connected');

        const result = await pool.request()
            .query('SELECT PK_Id, FK_user_id, FK_group_id FROM tbl_childrent_to_groups');

        return result.recordset.map((row: any) => this.mapToMember(row));
    }

    async create(group: Group): Promise<Group | null> {
        const pool = getPool();
        if (!pool) throw new Error('Database not connected');

        const result = await pool.request()
            .input('teacherId', sql.Int, group.FK_Teacher_id)
            .input('groupName', sql.VarChar(50), group.GroupName)
            .query(`
                INSERT INTO tbl_group (FK_Teacher_id, groupName)
                VALUES (@teacherId, @groupName);
                SELECT SCOPE_IDENTITY() AS Id;
            `);

        const newId = result.recordset[0]?.Id;
        if (newId) {
            return this.getById(newId);
        }
        return null;
    }

    async getById(id: number): Promise<Group | null> {
        const pool = getPool();
        if (!pool) throw new Error('Database not connected');

        const result = await pool.request()
            .input('id', sql.Int, id)
            .query('SELECT PK_Id, FK_Teacher_id FROM tbl_group WHERE PK_Id = @id');

        if (result.recordset.length === 0) return null;
        return this.mapToGroup(result.recordset[0]);
    }

    async delete(id: number): Promise<boolean> {
        const pool = getPool();
        if (!pool) throw new Error('Database not connected');

        await pool.request()
            .input('groupId', sql.Int, id)
            .query('DELETE FROM tbl_childrent_to_groups WHERE FK_group_id = @groupId');

        const result = await pool.request()
            .input('id', sql.Int, id)
            .query('DELETE FROM tbl_group WHERE PK_Id = @id');

        return result.rowsAffected[0] > 0;
    }

    async update(group: Group): Promise<boolean> {
        const pool = getPool();
        if (!pool) throw new Error('Database not connected');

        const request = pool.request();

        const result = await request
            .input('id', sql.Int, group.PK_Id)
            .input('name', sql.VarChar(50), group.GroupName)
            .query(`
            UPDATE tbl_group
            SET 
                groupName = @name
            WHERE PK_Id = @id
        `);

        return result.rowsAffected[0] > 0;
    }


    async addMember(groupId: number, userId: number): Promise<ChildGroupMember | null> {
        const pool = getPool();
        if (!pool) throw new Error('Database not connected');

        const existing = await this.getMember(groupId, userId);
        if (existing) return existing;

        try {
            const result = await pool.request()
                .input('groupId', sql.Int, groupId)
                .input('userId', sql.Int, userId)
                .query(`
                    INSERT INTO tbl_childrent_to_groups (FK_user_id, FK_group_id)
                    VALUES (@userId, @groupId);
                    SELECT SCOPE_IDENTITY() AS Id;
                `);

            const newId = result.recordset[0]?.Id;
            if (newId) {
                return this.getMemberById(newId);
            }
            return null;
        } catch (error) {
            return this.getMember(groupId, userId);
        }
    }

    async removeMember(groupId: number, userId: number): Promise<boolean> {
        const pool = getPool();
        if (!pool) throw new Error('Database not connected');

        const result = await pool.request()
            .input('groupId', sql.Int, groupId)
            .input('userId', sql.Int, userId)
            .query('DELETE FROM tbl_childrent_to_groups WHERE FK_group_id = @groupId AND FK_user_id = @userId');

        return result.rowsAffected[0] > 0;
    }

    async removeMemberById(memberId: number): Promise<boolean> {
        const pool = getPool();
        if (!pool) throw new Error('Database not connected');

        const result = await pool.request()
            .input('memberId', sql.Int, memberId)
            .query('DELETE FROM tbl_childrent_to_groups WHERE PK_Id = @memberId');

        return result.rowsAffected[0] > 0;
    }

    private mapToGroup(row: any): Group {
        const group = new Group();
        group.PK_Id = row.PK_Id;
        group.FK_Teacher_id = row.FK_Teacher_id;
        group.GroupName = row.groupName;
        return group;
    }

    private async getMember(groupId: number, userId: number): Promise<ChildGroupMember | null> {
        const pool = getPool();
        if (!pool) throw new Error('Database not connected');

        const result = await pool.request()
            .input('groupId', sql.Int, groupId)
            .input('userId', sql.Int, userId)
            .query('SELECT PK_Id, FK_user_id, FK_group_id FROM tbl_childrent_to_groups WHERE FK_group_id = @groupId AND FK_user_id = @userId');

        if (result.recordset.length === 0) return null;
        return this.mapToMember(result.recordset[0]);
    }

    private async getMemberById(id: number): Promise<ChildGroupMember | null> {
        const pool = getPool();
        if (!pool) throw new Error('Database not connected');

        const result = await pool.request()
            .input('id', sql.Int, id)
            .query('SELECT PK_Id, FK_user_id, FK_group_id FROM tbl_childrent_to_groups WHERE PK_Id = @id');

        if (result.recordset.length === 0) return null;
        return this.mapToMember(result.recordset[0]);
    }

    private mapToMember(row: any): ChildGroupMember {
        const member = new ChildGroupMember();
        member.PK_Id = row.PK_Id;
        member.FK_user_id = row.FK_user_id;
        member.FK_group_id = row.FK_group_id;
        return member;
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
            child.ChildInfo = {
                PK_Id: row.ChildInfo_PK_Id,
                FK_user_id: row.ChildInfo_FK_user_id,
                FK_disease_id: row.ChildInfo_FK_disease_id,
                complited_tasks_count: row.ChildInfo_complited_tasks_count,
                helpe_used_count: row.ChildInfo_helpe_used_count,
                miss_tasks_count: row.ChildInfo_miss_tasks_count,
                age: row.ChildInfo_age,
                speak_level: row.ChildInfo_speak_level
            };
        }

        return child;
    }
}
