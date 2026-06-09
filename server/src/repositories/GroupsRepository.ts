import * as sql from 'mssql';
import { getPool } from '../config/dbConfig';
import Group from '../entities/group';
import ChildGroupMember from '../entities/childrentToGroups';

export default class GroupsRepository {
    
    async getAll(): Promise<Group[]> {
        const pool = getPool();
        if (!pool) throw new Error('Database not connected');
        
        const result = await pool.request()
            .query('SELECT PK_Id, FK_Teacher_id FROM tbl_group');
        
        return result.recordset.map((row: any) => this.mapToGroup(row));
    }

    async getByEducator(educatorId: number): Promise<Group[]> {
        const pool = getPool();
        if (!pool) throw new Error('Database not connected');
        
        const result = await pool.request()
            .input('educatorId', sql.Int, educatorId)
            .query('SELECT PK_Id, FK_Teacher_id FROM tbl_group WHERE FK_Teacher_id = @educatorId');
        
        return result.recordset.map((row: any) => this.mapToGroup(row));
    }

    async getMembers(groupId: number): Promise<ChildGroupMember[]> {
        const pool = getPool();
        if (!pool) throw new Error('Database not connected');
        
        const result = await pool.request()
            .input('groupId', sql.Int, groupId)
            .query('SELECT PK_MemberId, FK_GroupId, FK_ChildId FROM tbl_childrent_to_groups WHERE FK_GroupId = @groupId');
        
        return result.recordset.map((row: any) => this.mapToMember(row));
    }

    async create(group: Group): Promise<Group | null> {
        const pool = getPool();
        if (!pool) throw new Error('Database not connected');
        
        const result = await pool.request()
            .input('teacherId', sql.Int, group.FK_Teacher_id)
            .query(`
                INSERT INTO tbl_group (FK_Teacher_id)
                VALUES (@teacherId);
                SELECT SCOPE_IDENTITY() as Id;
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
        
        const result = await pool.request()
            .input('id', sql.Int, id)
            .query('DELETE FROM tbl_group WHERE PK_Id = @id');
        
        return result.rowsAffected[0] > 0;
    }

    async addMember(groupId: number, childId: number): Promise<ChildGroupMember | null> {
        const pool = getPool();
        if (!pool) throw new Error('Database not connected');
        
        const result = await pool.request()
            .input('groupId', sql.Int, groupId)
            .input('childId', sql.Int, childId)
            .query(`
                INSERT INTO tbl_childrent_to_groups (FK_GroupId, FK_ChildId)
                VALUES (@groupId, @childId);
                SELECT SCOPE_IDENTITY() as Id;
            `);
        
        const newId = result.recordset[0]?.Id;
        if (newId) {
            return this.getMemberById(newId);
        }
        return null;
    }

    async removeMember(groupId: number, childId: number): Promise<boolean> {
        const pool = getPool();
        if (!pool) throw new Error('Database not connected');
        
        const result = await pool.request()
            .input('groupId', sql.Int, groupId)
            .input('childId', sql.Int, childId)
            .query('DELETE FROM tbl_childrent_to_groups WHERE FK_GroupId = @groupId AND FK_ChildId = @childId');
        
        return result.rowsAffected[0] > 0;
    }

    private mapToGroup(row: any): Group {
        const group = new Group();
        group.PK_Id = row.PK_Id;
        group.FK_Teacher_id = row.FK_Teacher_id;
        return group;
    }

    private mapToMember(row: any): ChildGroupMember {
        const member = new ChildGroupMember();
        member.PK_MemberId = row.PK_MemberId;
        member.FK_GroupId = row.FK_GroupId;
        member.FK_ChildId = row.FK_ChildId;
        return member;
    }

    private async getMemberById(id: number): Promise<ChildGroupMember | null> {
        const pool = getPool();
        if (!pool) throw new Error('Database not connected');
        
        const result = await pool.request()
            .input('id', sql.Int, id)
            .query('SELECT PK_MemberId, FK_GroupId, FK_ChildId FROM tbl_childrent_to_groups WHERE PK_MemberId = @id');
        
        if (result.recordset.length === 0) return null;
        return this.mapToMember(result.recordset[0]);
    }
}