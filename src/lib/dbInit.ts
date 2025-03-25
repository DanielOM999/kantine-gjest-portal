// src/lib/dbInit.ts
import { db } from '@/src/lib/db';

export async function initializeDatabase() {
  const client = await db.getClient();
  
  try {
    await client.query('BEGIN');

    // Create users table if not exists
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        phone VARCHAR(20) NOT NULL UNIQUE,
        is_connected BOOLEAN DEFAULT false,
        ip_address VARCHAR(45),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create index if not exists
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_users_phone 
      ON users(phone)
    `);

    await client.query('COMMIT');
    console.log('Database schema verified');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Database initialization failed:', error);
    throw error;
  } finally {
    client.release();
  }
}