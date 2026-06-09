import * as sql from 'mssql';

const config: sql.config = {
    server: 'MSI',
    database: 'db_diplom',
    user: 'DiplomUser',
    password: 'StrongPass123!',
    options: {
        encrypt: false,
        trustServerCertificate: true
    },
    pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 30000
    }
};

let pool: sql.ConnectionPool | null = null;

export async function connect(): Promise<sql.ConnectionPool> {
    if (pool?.connected) {
        return pool;
    }

    try {
        pool = await sql.connect(config);
        console.log('Подключение к БД установлено');

        pool.on('error', (err) => {
            console.error('Ошибка пула подключений:', err);
        });

        return pool;
    } catch (err) {
        console.error('Ошибка подключения к базе данных:', err);
        throw err;
    }
}

export function getPool(): sql.ConnectionPool | null {
    return pool;
}

export default config;
