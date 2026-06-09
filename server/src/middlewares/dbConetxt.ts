import { connect, getPool } from "../config/dbConfig";
import * as sql from 'mssql';

export async function initDatabase(): Promise<void> {
    await connect();
}

export function getConnection(): sql.ConnectionPool | null {
    return getPool();
}

export { sql };
