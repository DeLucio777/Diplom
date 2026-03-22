import sql from 'mssql';
import { getPool } from '../config/dbConfig';
import TaskConstruction from '../entities/taskConstructor';
import FindOddOneOutItem from '../entities/findOddOneOutItems';
import MatchImageWordPair from '../entities/matchImageWordPairs';
import SequenceItem from '../entities/sequenceItem';
import SortItem from '../entities/sortItem';

export default class TaskItemsRepository {
    
    // ===== Task Constructions =====
    async getConstructionsByTaskId(taskId: number): Promise<TaskConstruction[]> {
        const pool = getPool();
        if (!pool) throw new Error('Database not connected');
        
        const result = await pool.request()
            .input('taskId', sql.Int, taskId)
            .query('SELECT PK_ConstructionId, FK_TaskId, ParameterName, ParameterValue FROM tbl_TaskConstruction WHERE FK_TaskId = @taskId');
        
        return result.recordset.map((row: any) => this.mapToConstruction(row));
    }

    async createConstruction(construction: TaskConstruction): Promise<number> {
        const pool = getPool();
        if (!pool) throw new Error('Database not connected');
        
        const result = await pool.request()
            .input('taskId', sql.Int, construction.FK_TaskId)
            .input('paramName', sql.VarChar(100), construction.ParameterName)
            .input('paramValue', sql.VarChar(sql.MAX), construction.ParameterValue)
            .query(`
                INSERT INTO tbl_TaskConstruction (FK_TaskId, ParameterName, ParameterValue)
                VALUES (@taskId, @paramName, @paramValue);
                SELECT SCOPE_IDENTITY() as Id;
            `);
        
        return result.recordset[0].Id;
    }

    // ===== Find Odd One Out Items =====
    async getFindOddItemsByTaskId(taskId: number): Promise<FindOddOneOutItem[]> {
        const pool = getPool();
        if (!pool) throw new Error('Database not connected');
        
        const result = await pool.request()
            .input('taskId', sql.Int, taskId)
            .query('SELECT PK_ItemId, FK_TaskId, ItemText, IsOddOne, FK_pecsId FROM tbl_FindOddOneOutItems WHERE FK_TaskId = @taskId');
        
        return result.recordset.map((row: any) => this.mapToFindOddItem(row));
    }

    async createFindOddItem(item: FindOddOneOutItem): Promise<number> {
        const pool = getPool();
        if (!pool) throw new Error('Database not connected');
        
        const result = await pool.request()
            .input('taskId', sql.Int, item.FK_TaskId)
            .input('itemText', sql.VarChar(255), item.ItemText)
            .input('isOddOne', sql.Bit, item.IsOddOne ? 1 : 0)
            .input('pecsId', sql.Int, item.FK_pecsId)
            .query(`
                INSERT INTO tbl_FindOddOneOutItems (FK_TaskId, ItemText, IsOddOne, FK_pecsId)
                VALUES (@taskId, @itemText, @isOddOne, @pecsId);
                SELECT SCOPE_IDENTITY() as Id;
            `);
        
        return result.recordset[0].Id;
    }

    // ===== Match Image Word Pairs =====
    async getMatchPairsByTaskId(taskId: number): Promise<MatchImageWordPair[]> {
        const pool = getPool();
        if (!pool) throw new Error('Database not connected');
        
        const result = await pool.request()
            .input('taskId', sql.Int, taskId)
            .query('SELECT PK_PairId, FK_TaskId, FK_MediaId, FK_pecsId, Words FROM tbl_MatchImageWordPairs WHERE FK_TaskId = @taskId');
        
        return result.recordset.map((row: any) => this.mapToMatchPair(row));
    }

    async createMatchPair(pair: MatchImageWordPair): Promise<number> {
        const pool = getPool();
        if (!pool) throw new Error('Database not connected');
        
        const result = await pool.request()
            .input('taskId', sql.Int, pair.FK_TaskId)
            .input('mediaId', sql.Int, pair.FK_MediaId)
            .input('pecsId', sql.Int, pair.FK_pecsId)
            .input('words', sql.VarChar(255), pair.Words)
            .query(`
                INSERT INTO tbl_MatchImageWordPairs (FK_TaskId, FK_MediaId, FK_pecsId, Words)
                VALUES (@taskId, @mediaId, @pecsId, @words);
                SELECT SCOPE_IDENTITY() as Id;
            `);
        
        return result.recordset[0].Id;
    }

    // ===== Sequence Items =====
    async getSequenceItemsByTaskId(taskId: number): Promise<SequenceItem[]> {
        const pool = getPool();
        if (!pool) throw new Error('Database not connected');
        
        const result = await pool.request()
            .input('taskId', sql.Int, taskId)
            .query('SELECT PK_SeqItemId, FK_TaskId, ItemOrder, ItemValue, FK_pecsId FROM tbl_SequenceItems WHERE FK_TaskId = @taskId ORDER BY ItemOrder');
        
        return result.recordset.map((row: any) => this.mapToSequenceItem(row));
    }

    async createSequenceItem(item: SequenceItem): Promise<number> {
        const pool = getPool();
        if (!pool) throw new Error('Database not connected');
        
        const result = await pool.request()
            .input('taskId', sql.Int, item.FK_TaskId)
            .input('itemOrder', sql.Int, item.ItemOrder)
            .input('itemValue', sql.VarChar(255), item.ItemValue)
            .input('pecsId', sql.Int, item.FK_pecsId)
            .query(`
                INSERT INTO tbl_SequenceItems (FK_TaskId, ItemOrder, ItemValue, FK_pecsId)
                VALUES (@taskId, @itemOrder, @itemValue, @pecsId);
                SELECT SCOPE_IDENTITY() as Id;
            `);
        
        return result.recordset[0].Id;
    }

    // ===== Sort Items =====
    async getSortItemsByTaskId(taskId: number): Promise<SortItem[]> {
        const pool = getPool();
        if (!pool) throw new Error('Database not connected');
        
        const result = await pool.request()
            .input('taskId', sql.Int, taskId)
            .query('SELECT PK_SortItemId, FK_TaskId, ItemValue, SortKey, FK_pecsId FROM tbl_SortItems WHERE FK_TaskId = @taskId');
        
        return result.recordset.map((row: any) => this.mapToSortItem(row));
    }

    async createSortItem(item: SortItem): Promise<number> {
        const pool = getPool();
        if (!pool) throw new Error('Database not connected');
        
        const result = await pool.request()
            .input('taskId', sql.Int, item.FK_TaskId)
            .input('itemValue', sql.VarChar(255), item.ItemValue)
            .input('sortKey', sql.VarChar(255), item.SortKey)
            .input('pecsId', sql.Int, item.FK_pecsId)
            .query(`
                INSERT INTO tbl_SortItems (FK_TaskId, ItemValue, SortKey, FK_pecsId)
                VALUES (@taskId, @itemValue, @sortKey, @pecsId);
                SELECT SCOPE_IDENTITY() as Id;
            `);
        
        return result.recordset[0].Id;
    }

    // ===== Mappers =====
    private mapToConstruction(row: any): TaskConstruction {
        const c = new TaskConstruction();
        c.PK_ConstructionId = row.PK_ConstructionId;
        c.FK_TaskId = row.FK_TaskId;
        c.ParameterName = row.ParameterName;
        c.ParameterValue = row.ParameterValue;
        return c;
    }

    private mapToFindOddItem(row: any): FindOddOneOutItem {
        const item = new FindOddOneOutItem();
        item.PK_ItemId = row.PK_ItemId;
        item.FK_TaskId = row.FK_TaskId;
        item.ItemText = row.ItemText;
        item.IsOddOne = Boolean(row.IsOddOne);
        item.FK_pecsId = row.FK_pecsId;
        return item;
    }

    private mapToMatchPair(row: any): MatchImageWordPair {
        const pair = new MatchImageWordPair();
        pair.PK_PairId = row.PK_PairId;
        pair.FK_TaskId = row.FK_TaskId;
        pair.FK_MediaId = row.FK_MediaId;
        pair.FK_pecsId = row.FK_pecsId;
        pair.Words = row.Words;
        return pair;
    }

    private mapToSequenceItem(row: any): SequenceItem {
        const item = new SequenceItem();
        item.PK_SeqItemId = row.PK_SeqItemId;
        item.FK_TaskId = row.FK_TaskId;
        item.ItemOrder = row.ItemOrder;
        item.ItemValue = row.ItemValue;
        item.FK_pecsId = row.FK_pecsId;
        return item;
    }

    private mapToSortItem(row: any): SortItem {
        const item = new SortItem();
        item.PK_SortItemId = row.PK_SortItemId;
        item.FK_TaskId = row.FK_TaskId;
        item.ItemValue = row.ItemValue;
        item.SortKey = row.SortKey;
        item.FK_pecsId = row.FK_pecsId;
        return item;
    }
}
