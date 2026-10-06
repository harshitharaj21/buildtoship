import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pg from 'pg';
import dotenv from 'dotenv';

// Determine __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from potential locations (.env in root, server, or cwd)
const envPaths = [
  path.resolve(__dirname, '../.env'),
  path.resolve(__dirname, '../../.env'),
  path.resolve(__dirname, '../../server/.env'),
  path.resolve(process.cwd(), '.env'),
  path.resolve(process.cwd(), 'server/.env')
];

for (const envPath of envPaths) {
  if (fs.existsSync(envPath)) {
    dotenv.config({ path: envPath });
  }
}

const { Client } = pg;

async function runMigrations() {
  console.log('🚀 Starting Supabase Database Migration Runner...\n');

  const connectionString = process.env.DATABASE_URL || process.env.DIRECT_URL;

  if (!connectionString) {
    console.error('❌ Error: Missing DATABASE_URL or DIRECT_URL in environment variables.');
    console.error('Please provide your Supabase PostgreSQL connection string in your .env file:');
    console.error('DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres\n');
    process.exit(1);
  }

  const client = new Client({
    connectionString,
    ssl: {
      rejectUnauthorized: false // Required for Supabase SSL connections
    }
  });

  try {
    console.log('🔌 Connecting to Supabase PostgreSQL database...');
    await client.connect();
    console.log('✅ Connected successfully!\n');

    const migrationsDir = path.resolve(__dirname, '../migrations');
    if (!fs.existsSync(migrationsDir)) {
      throw new Error(`Migrations directory not found at: ${migrationsDir}`);
    }

    const files = fs
      .readdirSync(migrationsDir)
      .filter((file) => file.endsWith('.sql'))
      .sort();

    if (files.length === 0) {
      console.log('⚠️ No SQL migration files found in migrations directory.');
      return;
    }

    console.log(`📦 Found ${files.length} migration file(s) to process:\n`);

    for (const file of files) {
      const filePath = path.join(migrationsDir, file);
      console.log(`⏳ Applying migration: ${file}...`);
      const sql = fs.readFileSync(filePath, 'utf-8');

      const startTime = Date.now();
      await client.query(sql);
      const duration = Date.now() - startTime;

      console.log(`✅ Applied ${file} (${duration}ms)`);
    }

    console.log('\n🎉 All migrations applied successfully to Supabase PostgreSQL!');
  } catch (error) {
    console.error('\n❌ Migration failed with error:');
    console.error(error.message);
    if (error.position) {
      console.error(`Position: ${error.position}`);
    }
    process.exit(1);
  } finally {
    await client.end();
    console.log('🔌 Disconnected from database.');
  }
}

runMigrations();
