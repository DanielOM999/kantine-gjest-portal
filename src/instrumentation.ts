// instrumentation.ts
import { initializeDatabase } from '@/src/lib/dbInit';

export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    console.log('Starting database initialization...');
    try {
      await initializeDatabase();
      
      // Optional: Run migrations
      await runMigrations();
      
      console.log('Database setup completed');
    } catch (error) {
      console.error('Database setup failed:', error);
      process.exit(1);
    }
  }
}

async function runMigrations() {
  // Add your migration logic here
  // Example: await db.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS ...`);
}