import sql from 'mssql';
import { getPool } from '../config/dbConfig';
import LearningTrajectory from '../entities/learningTrajectory';
import TrajectoryStep from '../entities/trajectoryStep';

export default class TrajectoriesRepository {
    
    async getAll(): Promise<LearningTrajectory[]> {
        const pool = getPool();
        if (!pool) throw new Error('Database not connected');
        
        const result = await pool.request()
            .query('SELECT PK_TrajectoryId, TrajectoryName, FK_EducatorId, Descripti FROM tbl_LearningTrajectory');
        
        return result.recordset.map((row: any) => this.mapToTrajectory(row));
    }

    async getSteps(trajectoryId: number): Promise<TrajectoryStep[]> {
        const pool = getPool();
        if (!pool) throw new Error('Database not connected');
        
        const result = await pool.request()
            .input('trajectoryId', sql.Int, trajectoryId)
            .query('SELECT PK_StepId, FK_TrajectoryId, FK_TaskId, StepOrder FROM tbl_TrajectoryStep WHERE FK_TrajectoryId = @trajectoryId ORDER BY StepOrder');
        
        return result.recordset.map((row: any) => this.mapToStep(row));
    }

    async create(trajectory: LearningTrajectory): Promise<LearningTrajectory | null> {
        const pool = getPool();
        if (!pool) throw new Error('Database not connected');
        
        const result = await pool.request()
            .input('name', sql.VarChar(100), trajectory.TrajectoryName)
            .input('educatorId', sql.Int, trajectory.FK_EducatorId)
            .input('description', sql.VarChar(255), trajectory.Descripti)
            .query(`
                INSERT INTO tbl_LearningTrajectory (TrajectoryName, FK_EducatorId, Descripti)
                VALUES (@name, @educatorId, @description);
                SELECT SCOPE_IDENTITY() as Id;
            `);
        
        const newId = result.recordset[0]?.Id;
        if (newId) {
            return this.getById(newId);
        }
        return null;
    }

    async getById(id: number): Promise<LearningTrajectory | null> {
        const pool = getPool();
        if (!pool) throw new Error('Database not connected');
        
        const result = await pool.request()
            .input('id', sql.Int, id)
            .query('SELECT PK_TrajectoryId, TrajectoryName, FK_EducatorId, Descripti FROM tbl_LearningTrajectory WHERE PK_TrajectoryId = @id');
        
        if (result.recordset.length === 0) return null;
        return this.mapToTrajectory(result.recordset[0]);
    }

    private mapToTrajectory(row: any): LearningTrajectory {
        const trajectory = new LearningTrajectory();
        trajectory.PK_TrajectoryId = row.PK_TrajectoryId;
        trajectory.TrajectoryName = row.TrajectoryName;
        trajectory.FK_EducatorId = row.FK_EducatorId;
        trajectory.Descripti = row.Descripti;
        return trajectory;
    }

    private mapToStep(row: any): TrajectoryStep {
        const step = new TrajectoryStep();
        step.PK_StepId = row.PK_StepId;
        step.FK_TrajectoryId = row.FK_TrajectoryId;
        step.FK_TaskId = row.FK_TaskId;
        step.StepOrder = row.StepOrder;
        return step;
    }
}