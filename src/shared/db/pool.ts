import { Pool } from 'pg';

let poolInstance: Pool | null = null;

export function getPool(): Pool {
    if (!poolInstance) {
        poolInstance = new Pool({
            connectionString: process.env.DATABASE_URL,
        });
    }
    return poolInstance;
}