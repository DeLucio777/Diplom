import sql from 'mssql';
import { getPool } from '../config/dbConfig';
import TaskAssignment from '../entities/taskAssignment';

export default class AssignmentsRepository {
    
    async getAll(): Promise<TaskAssignment[]> {
        const pool = getPool();
        if (!pool) throw new Error('Database not connected');
        
        const result = await pool.request()
            .query('SELECT PK_AssignmentId, FK_TaskId, FK_ChildId, AssignedDate, DueDate, Status FROM tbl_Assignment');
        
        return result.recordset.map((row: any) => this.mapToAssignment(row));
    }

    async getByChild(childId: number): Promise<TaskAssignment[]> {
        const pool = getPool();
        if (!pool) throw new Error('Database not connected');
        
        const result = await pool.request()
            .input('childId', sql.Int, childId)
            .query('SELECT PK_AssignmentId, FK_TaskId, FK_ChildId, AssignedDate, DueDate, Status FROM tbl_Assignment WHERE FK_ChildId = @childId');
        
        return result.recordset.map((row: any) => this.mapToAssignment(row));
    }

    async create(assignment: TaskAssignment): Promise<TaskAssignment | null> {
        const pool = getPool();
        if (!pool) throw new Error('Database not connected');
        
        const result = await pool.request()
            .input('taskId', sql.Int, assignment.FK_TaskId)
            .input('childId', sql.Int, assignment.FK_ChildId)
            .input('dueDate', sql.DateTime, assignment.DueDate)
            .input('status', sql.VarChar(50), assignment.Status)
            .query(`
                INSERT INTO tbl_Assignment (FK_TaskId, FK_ChildId, AssignedDate, DueDate, Status)
                VALUES (@taskId, @childId, GETDATE(), @dueDate, @status);
                SELECT SCOPE_IDENTITY() as Id;
            `);
        
        const newId = result.recordset[0]?.Id;
        if (newId) {
            return this.getById(newId);
        }
        return null;
    }

    async getById(id: number): Promise<TaskAssignment | null> {
        const pool = getPool();
        if (!pool) throw new Error('Database not connected');
        
        const result = await pool.request()
            .input('id', sql.Int, id)
            .query('SELECT PK_AssignmentId, FK_TaskId, FK_ChildId, AssignedDate, DueDate, Status FROM tbl_Assignment WHERE PK_AssignmentId = @id');
        
        if (result.recordset.length === 0) return null;
        return this.mapToAssignment(result.recordset[0]);
    }

    async updateStatus(id: number, status: string): Promise<boolean> {
        const pool = getPool();
        if (!pool) throw new Error('Database not connected');
        
        const result = await pool.request()
            .input('id', sql.Int, id)
            .input('status', sql.VarChar(50), status)
            .query('UPDATE tbl_Assignment SET Status = @status WHERE PK_AssignmentId = @id');
        
        return result.rowsAffected[0] > 0;
    }

    private mapToAssignment(row: any): TaskAssignment {
        const assignment = new TaskAssignment();
        assignment.PK_AssignmentId = row.PK_AssignmentId;
        assignment.FK_TaskId = row.FK_TaskId;
        assignment.FK_ChildId = row.FK_ChildId;
        assignment.AssignedDate = row.AssignedDate;
        assignment.DueDate = row.DueDate;
        assignment.Status = row.Status;
        return assignment;
    }
}