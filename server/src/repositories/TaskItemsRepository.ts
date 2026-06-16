import * as sql from 'mssql';
import { getPool } from '../config/dbConfig';
import TaskConstruction from '../entities/taskConstructor';
import FindOddOneOutItem from '../entities/findOddOneOutItems';
import MatchImageWordPair from '../entities/matchImageWordPairs';
import SequenceItem from '../entities/sequenceItem';
import SortItem from '../entities/sortItem';

export default class TaskItemsRepository {
    async getAllConstructions(): Promise<TaskConstruction[]> {
        const pool = getPool();
        if (!pool) throw new Error('Database not connected');

        const result = await pool.request()
            .query('SELECT PK_ConstructionId, FK_TaskId, ParameterName, ParameterValue, Help FROM tbl_TaskConstruction ORDER BY FK_TaskId, PK_ConstructionId');

        return result.recordset.map((row: any) => this.mapToConstruction(row));
    }

    async getConstructionById(id: number): Promise<TaskConstruction | null> {
        const pool = getPool();
        if (!pool) throw new Error('Database not connected');

        const result = await pool.request()
            .input('id', sql.Int, id)
            .query('SELECT PK_ConstructionId, FK_TaskId, ParameterName, ParameterValue, Help FROM tbl_TaskConstruction WHERE PK_ConstructionId = @id');

        if (result.recordset.length === 0) return null;
        return this.mapToConstruction(result.recordset[0]);
    }

    async getConstructionsByTaskId(taskId: number): Promise<TaskConstruction[]> {
        const pool = getPool();
        if (!pool) throw new Error('Database not connected');

        const result = await pool.request()
            .input('taskId', sql.Int, taskId)
            .query('SELECT PK_ConstructionId, FK_TaskId, ParameterName, ParameterValue, Help FROM tbl_TaskConstruction WHERE FK_TaskId = @taskId ORDER BY PK_ConstructionId');

        return result.recordset.map((row: any) => this.mapToConstruction(row));
    }

    async createConstruction(construction: TaskConstruction): Promise<number> {
        const pool = getPool();
        if (!pool) throw new Error('Database not connected');

        const result = await pool.request()
            .input('taskId', sql.Int, construction.FK_TaskId)
            .input('paramName', sql.VarChar(100), construction.ParameterName)
            .input('paramValue', sql.VarChar(sql.MAX), construction.ParameterValue)
            .input('help', sql.VarChar(255), construction.Help || null)
            .query(`
                INSERT INTO tbl_TaskConstruction (FK_TaskId, ParameterName, ParameterValue, Help)
                OUTPUT INSERTED.PK_ConstructionId
                VALUES (@taskId, @paramName, @paramValue, @help);
            `);

        return result.recordset[0]?.PK_ConstructionId || 0;
    }

    async updateConstruction(id: number, construction: TaskConstruction): Promise<boolean> {
        const pool = getPool();
        if (!pool) throw new Error('Database not connected');

        const result = await pool.request()
            .input('id', sql.Int, id)
            .input('taskId', sql.Int, construction.FK_TaskId)
            .input('paramName', sql.VarChar(100), construction.ParameterName)
            .input('paramValue', sql.VarChar(sql.MAX), construction.ParameterValue)
            .input('help', sql.VarChar(255), construction.Help || null)
            .query(`
                UPDATE tbl_TaskConstruction
                SET FK_TaskId = @taskId,
                    ParameterName = @paramName,
                    ParameterValue = @paramValue,
                    Help = @help
                WHERE PK_ConstructionId = @id
            `);

        return result.rowsAffected[0] > 0;
    }

    async deleteConstruction(id: number): Promise<boolean> {
        const pool = getPool();
        if (!pool) throw new Error('Database not connected');

        const result = await pool.request()
            .input('id', sql.Int, id)
            .query('DELETE FROM tbl_TaskConstruction WHERE PK_ConstructionId = @id');

        return result.rowsAffected[0] > 0;
    }

    async getAllFindOddItems(): Promise<FindOddOneOutItem[]> {
        const pool = getPool();
        if (!pool) throw new Error('Database not connected');

        const result = await pool.request()
            .query('SELECT PK_ItemId, FK_TaskId, ItemText, IsOddOne, FK_pecsId FROM tbl_FindOddOneOutItems ORDER BY FK_TaskId, PK_ItemId');

        return result.recordset.map((row: any) => this.mapToFindOddItem(row));
    }

    async getFindOddItemById(id: number): Promise<FindOddOneOutItem | null> {
        const pool = getPool();
        if (!pool) throw new Error('Database not connected');

        const result = await pool.request()
            .input('id', sql.Int, id)
            .query('SELECT PK_ItemId, FK_TaskId, ItemText, IsOddOne, FK_pecsId FROM tbl_FindOddOneOutItems WHERE PK_ItemId = @id');

        if (result.recordset.length === 0) return null;
        return this.mapToFindOddItem(result.recordset[0]);
    }

    async getFindOddItemsByTaskId(taskId: number): Promise<FindOddOneOutItem[]> {
        const pool = getPool();
        if (!pool) throw new Error('Database not connected');

        const result = await pool.request()
            .input('taskId', sql.Int, taskId)
            .query('SELECT PK_ItemId, FK_TaskId, ItemText, IsOddOne, FK_pecsId FROM tbl_FindOddOneOutItems WHERE FK_TaskId = @taskId ORDER BY PK_ItemId');

        return result.recordset.map((row: any) => this.mapToFindOddItem(row));
    }

    async createFindOddItem(item: FindOddOneOutItem): Promise<number> {
        const pool = getPool();
        if (!pool) throw new Error('Database not connected');

        const result = await pool.request()
            .input('taskId', sql.Int, item.FK_TaskId)
            .input('itemText', sql.VarChar(255), item.ItemText)
            .input('isOddOne', sql.Bit, item.IsOddOne ? 1 : 0)
            .input('pecsId', sql.Int, item.FK_pecsId ?? null)
            .query(`
                INSERT INTO tbl_FindOddOneOutItems (FK_TaskId, ItemText, IsOddOne, FK_pecsId)
                OUTPUT INSERTED.PK_ItemId
                VALUES (@taskId, @itemText, @isOddOne, @pecsId);
            `);

        return result.recordset[0]?.PK_ItemId || 0;
    }

    async updateFindOddItem(id: number, item: FindOddOneOutItem): Promise<boolean> {
        const pool = getPool();
        if (!pool) throw new Error('Database not connected');

        const result = await pool.request()
            .input('id', sql.Int, id)
            .input('taskId', sql.Int, item.FK_TaskId)
            .input('itemText', sql.VarChar(255), item.ItemText)
            .input('isOddOne', sql.Bit, item.IsOddOne ? 1 : 0)
            .input('pecsId', sql.Int, item.FK_pecsId ?? null)
            .query(`
                UPDATE tbl_FindOddOneOutItems
                SET FK_TaskId = @taskId,
                    ItemText = @itemText,
                    IsOddOne = @isOddOne,
                    FK_pecsId = @pecsId
                WHERE PK_ItemId = @id
            `);

        return result.rowsAffected[0] > 0;
    }

    async deleteFindOddItem(id: number): Promise<boolean> {
        const pool = getPool();
        if (!pool) throw new Error('Database not connected');

        const result = await pool.request()
            .input('id', sql.Int, id)
            .query('DELETE FROM tbl_FindOddOneOutItems WHERE PK_ItemId = @id');

        return result.rowsAffected[0] > 0;
    }

    async getAllMatchPairs(): Promise<MatchImageWordPair[]> {
        const pool = getPool();
        if (!pool) throw new Error('Database not connected');

        const result = await pool.request()
            .query('SELECT PK_PairId, FK_TaskId, FK_MediaId, FK_pecsId, Words FROM tbl_MatchImageWordPairs ORDER BY FK_TaskId, PK_PairId');

        return result.recordset.map((row: any) => this.mapToMatchPair(row));
    }

    async getMatchPairById(id: number): Promise<MatchImageWordPair | null> {
        const pool = getPool();
        if (!pool) throw new Error('Database not connected');

        const result = await pool.request()
            .input('id', sql.Int, id)
            .query('SELECT PK_PairId, FK_TaskId, FK_MediaId, FK_pecsId, Words FROM tbl_MatchImageWordPairs WHERE PK_PairId = @id');

        if (result.recordset.length === 0) return null;
        return this.mapToMatchPair(result.recordset[0]);
    }

    async getMatchPairsByTaskId(taskId: number): Promise<MatchImageWordPair[]> {
        const pool = getPool();
        if (!pool) throw new Error('Database not connected');

        const result = await pool.request()
            .input('taskId', sql.Int, taskId)
            .query('SELECT PK_PairId, FK_TaskId, FK_MediaId, FK_pecsId, Words FROM tbl_MatchImageWordPairs WHERE FK_TaskId = @taskId ORDER BY PK_PairId');

        return result.recordset.map((row: any) => this.mapToMatchPair(row));
    }

    async createMatchPair(pair: MatchImageWordPair): Promise<number> {
        const pool = getPool();
        if (!pool) throw new Error('Database not connected');

        const result = await pool.request()
            .input('taskId', sql.Int, pair.FK_TaskId)
            .input('mediaId', sql.Int, pair.FK_MediaId ?? 0)
            .input('pecsId', sql.Int, pair.FK_pecsId ?? null)
            .input('words', sql.VarChar(255), pair.Words)
            .query(`
                INSERT INTO tbl_MatchImageWordPairs (FK_TaskId, FK_MediaId, FK_pecsId, Words)
                OUTPUT INSERTED.PK_PairId
                VALUES (@taskId, @mediaId, @pecsId, @words);
            `);

        return result.recordset[0]?.PK_PairId || 0;
    }

    async updateMatchPair(id: number, pair: MatchImageWordPair): Promise<boolean> {
        const pool = getPool();
        if (!pool) throw new Error('Database not connected');

        const result = await pool.request()
            .input('id', sql.Int, id)
            .input('taskId', sql.Int, pair.FK_TaskId)
            .input('mediaId', sql.Int, pair.FK_MediaId ?? 0)
            .input('pecsId', sql.Int, pair.FK_pecsId ?? null)
            .input('words', sql.VarChar(255), pair.Words)
            .query(`
                UPDATE tbl_MatchImageWordPairs
                SET FK_TaskId = @taskId,
                    FK_MediaId = @mediaId,
                    FK_pecsId = @pecsId,
                    Words = @words
                WHERE PK_PairId = @id
            `);

        return result.rowsAffected[0] > 0;
    }

    async deleteMatchPair(id: number): Promise<boolean> {
        const pool = getPool();
        if (!pool) throw new Error('Database not connected');

        const result = await pool.request()
            .input('id', sql.Int, id)
            .query('DELETE FROM tbl_MatchImageWordPairs WHERE PK_PairId = @id');

        return result.rowsAffected[0] > 0;
    }

    async getAllSequenceItems(): Promise<SequenceItem[]> {
        const pool = getPool();
        if (!pool) throw new Error('Database not connected');

        const result = await pool.request()
            .query('SELECT PK_SeqItemId, FK_TaskId, ItemOrder, ItemValue, FK_pecsId FROM tbl_SequenceItems ORDER BY FK_TaskId, ItemOrder, PK_SeqItemId');

        return result.recordset.map((row: any) => this.mapToSequenceItem(row));
    }


    async getSequenceItemById(id: number): Promise<SequenceItem | null> {
        const pool = getPool();
        if (!pool) throw new Error('Database not connected');

        const result = await pool.request()
            .input('id', sql.Int, id)
            .query('SELECT PK_SeqItemId, FK_TaskId, ItemOrder, ItemValue, FK_pecsId FROM tbl_SequenceItems WHERE PK_SeqItemId = @id');

        if (result.recordset.length === 0) return null;
        return this.mapToSequenceItem(result.recordset[0]);
    }

    async getSequenceItemsByTaskId(taskId: number): Promise<SequenceItem[]> {
        const pool = getPool();
        if (!pool) throw new Error('Database not connected');

        const result = await pool.request()
            .input('taskId', sql.Int, taskId)
            .query('SELECT PK_SeqItemId, FK_TaskId, ItemOrder, ItemValue, FK_pecsId FROM tbl_SequenceItems WHERE FK_TaskId = @taskId ORDER BY ItemOrder, PK_SeqItemId');

        return result.recordset.map((row: any) => this.mapToSequenceItem(row));
    }

    async createSequenceItem(item: SequenceItem): Promise<number> {
        const pool = getPool();
        if (!pool) throw new Error('Database not connected');

        const result = await pool.request()
            .input('taskId', sql.Int, item.FK_TaskId)
            .input('itemOrder', sql.Int, item.ItemOrder)
            .input('itemValue', sql.VarChar(255), item.ItemValue)
            .input('pecsId', sql.Int, item.FK_pecsId ?? null)
            .query(`
                INSERT INTO tbl_SequenceItems (FK_TaskId, ItemOrder, ItemValue, FK_pecsId)
                OUTPUT INSERTED.PK_SeqItemId
                VALUES (@taskId, @itemOrder, @itemValue, @pecsId);
            `);

        return result.recordset[0]?.PK_SeqItemId || 0;
    }

    async updateSequenceItem(id: number, item: SequenceItem): Promise<boolean> {
        const pool = getPool();
        if (!pool) throw new Error('Database not connected');

        const result = await pool.request()
            .input('id', sql.Int, id)
            .input('taskId', sql.Int, item.FK_TaskId)
            .input('itemOrder', sql.Int, item.ItemOrder)
            .input('itemValue', sql.VarChar(255), item.ItemValue)
            .input('pecsId', sql.Int, item.FK_pecsId ?? null)
            .query(`
                UPDATE tbl_SequenceItems
                SET FK_TaskId = @taskId,
                    ItemOrder = @itemOrder,
                    ItemValue = @itemValue,
                    FK_pecsId = @pecsId
                WHERE PK_SeqItemId = @id
            `);

        return result.rowsAffected[0] > 0;
    }

    async deleteSequenceItem(id: number): Promise<boolean> {
        const pool = getPool();
        if (!pool) throw new Error('Database not connected');

        const result = await pool.request()
            .input('id', sql.Int, id)
            .query('DELETE FROM tbl_SequenceItems WHERE PK_SeqItemId = @id');

        return result.rowsAffected[0] > 0;
    }

    async getAllSortItems(): Promise<SortItem[]> {
        const pool = getPool();
        if (!pool) throw new Error('Database not connected');

        const result = await pool.request()
            .query('SELECT PK_SortItemId, FK_TaskId, ItemValue, SortKey, FK_pecsId FROM tbl_SortItems ORDER BY FK_TaskId, SortKey, PK_SortItemId');

        return result.recordset.map((row: any) => this.mapToSortItem(row));
    }

    async getSortItemById(id: number): Promise<SortItem | null> {
        const pool = getPool();
        if (!pool) throw new Error('Database not connected');

        const result = await pool.request()
            .input('id', sql.Int, id)
            .query('SELECT PK_SortItemId, FK_TaskId, ItemValue, SortKey, FK_pecsId FROM tbl_SortItems WHERE PK_SortItemId = @id');

        if (result.recordset.length === 0) return null;
        return this.mapToSortItem(result.recordset[0]);
    }

    async getSortItemsByTaskId(taskId: number): Promise<SortItem[]> {
        const pool = getPool();
        if (!pool) throw new Error('Database not connected');

        const result = await pool.request()
            .input('taskId', sql.Int, taskId)
            .query('SELECT PK_SortItemId, FK_TaskId, ItemValue, SortKey, FK_pecsId FROM tbl_SortItems WHERE FK_TaskId = @taskId ORDER BY SortKey, PK_SortItemId');

        return result.recordset.map((row: any) => this.mapToSortItem(row));
    }

    async createSortItem(item: SortItem): Promise<number> {
        const pool = getPool();
        if (!pool) throw new Error('Database not connected');

        const result = await pool.request()
            .input('taskId', sql.Int, item.FK_TaskId)
            .input('itemValue', sql.VarChar(255), item.ItemValue)
            .input('sortKey', sql.VarChar(255), item.SortKey)
            .input('pecsId', sql.Int, item.FK_pecsId ?? null)
            .query(`
                INSERT INTO tbl_SortItems (FK_TaskId, ItemValue, SortKey, FK_pecsId)
                OUTPUT INSERTED.PK_SortItemId
                VALUES (@taskId, @itemValue, @sortKey, @pecsId);
            `);

        return result.recordset[0]?.PK_SortItemId || 0;
    }

    async updateSortItem(id: number, item: SortItem): Promise<boolean> {
        const pool = getPool();
        if (!pool) throw new Error('Database not connected');

        const result = await pool.request()
            .input('id', sql.Int, id)
            .input('taskId', sql.Int, item.FK_TaskId)
            .input('itemValue', sql.VarChar(255), item.ItemValue)
            .input('sortKey', sql.VarChar(255), item.SortKey)
            .input('pecsId', sql.Int, item.FK_pecsId ?? null)
            .query(`
                UPDATE tbl_SortItems
                SET FK_TaskId = @taskId,
                    ItemValue = @itemValue,
                    SortKey = @sortKey,
                    FK_pecsId = @pecsId
                WHERE PK_SortItemId = @id
            `);

        return result.rowsAffected[0] > 0;
    }

    async deleteSortItem(id: number): Promise<boolean> {
        const pool = getPool();
        if (!pool) throw new Error('Database not connected');

        const result = await pool.request()
            .input('id', sql.Int, id)
            .query('DELETE FROM tbl_SortItems WHERE PK_SortItemId = @id');

        return result.rowsAffected[0] > 0;
    }

    async deleteConstructionsByTaskId(taskId: number): Promise<boolean> {
        const pool = getPool();
        if (!pool) throw new Error('Database not connected');

        await pool.request()
            .input('taskId', sql.Int, taskId)
            .query('DELETE FROM tbl_TaskConstruction WHERE FK_TaskId = @taskId');

        return true;
    }

    async deleteFindOddItemsByTaskId(taskId: number): Promise<boolean> {
        const pool = getPool();
        if (!pool) throw new Error('Database not connected');

        await pool.request()
            .input('taskId', sql.Int, taskId)
            .query('DELETE FROM tbl_FindOddOneOutItems WHERE FK_TaskId = @taskId');

        return true;
    }

    async deleteMatchPairsByTaskId(taskId: number): Promise<boolean> {
        const pool = getPool();
        if (!pool) throw new Error('Database not connected');

        await pool.request()
            .input('taskId', sql.Int, taskId)
            .query('DELETE FROM tbl_MatchImageWordPairs WHERE FK_TaskId = @taskId');

        return true;
    }

    async deleteSequenceItemsByTaskId(taskId: number): Promise<boolean> {
        const pool = getPool();
        if (!pool) throw new Error('Database not connected');

        await pool.request()
            .input('taskId', sql.Int, taskId)
            .query('DELETE FROM tbl_SequenceItems WHERE FK_TaskId = @taskId');

        return true;
    }

    async deleteSortItemsByTaskId(taskId: number): Promise<boolean> {
        const pool = getPool();
        if (!pool) throw new Error('Database not connected');

        await pool.request()
            .input('taskId', sql.Int, taskId)
            .query('DELETE FROM tbl_SortItems WHERE FK_TaskId = @taskId');

        return true;
    }

    private mapToConstruction(row: any): TaskConstruction {
        const c = new TaskConstruction();
        c.PK_ConstructionId = row.PK_ConstructionId;
        c.FK_TaskId = row.FK_TaskId;
        c.ParameterName = row.ParameterName;
        c.ParameterValue = row.ParameterValue;
        c.Help = row.Help;
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
