import pg from 'pg';

export const pool = new pg.Pool({
    connectionString: process.env.DATABASE_URL,
});

export async function initDatabase(): Promise<void> {
    await pool.query(`
    CREATE TABLE IF NOT EXISTS rows (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255),
      company VARCHAR(255),
      department VARCHAR(100),
      job_title VARCHAR(255),
      salary NUMERIC(12, 2),
      age INTEGER,
      country VARCHAR(100),
      city VARCHAR(100),
      status VARCHAR(50),
      priority VARCHAR(50),
      category VARCHAR(100),
      tags TEXT,
      notes TEXT,
      website VARCHAR(255),
      phone VARCHAR(50),
      start_date DATE,
      is_active BOOLEAN DEFAULT true,
      rating NUMERIC(3, 2),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    CREATE INDEX IF NOT EXISTS idx_rows_status ON rows(status);
    CREATE INDEX IF NOT EXISTS idx_rows_department ON rows(department);
  `);
}