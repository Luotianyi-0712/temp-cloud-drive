const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

// Initialize database tables
async function initializeDatabase() {
  try {
    // Create files table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS files (
        id SERIAL PRIMARY KEY,
        file_name TEXT NOT NULL,
        file_content BYTEA NOT NULL,
        access_code TEXT UNIQUE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        expires_at TIMESTAMP NOT NULL,
        downloads INTEGER DEFAULT 0
      )
    `);
    
    // Create admins table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS admins (
        id SERIAL PRIMARY KEY,
        api_key TEXT UNIQUE NOT NULL
      )
    `);
    
    // Create indexes
    await pool.query(`CREATE INDEX IF NOT EXISTS idx_access_code ON files(access_code)`);
    await pool.query(`CREATE INDEX IF NOT EXISTS idx_expires_at ON files(expires_at)`);
    
    // Insert default admin API key if not exists
    const adminApiKey = process.env.ADMIN_API_KEY;
    if (adminApiKey) {
      await pool.query(
        `INSERT INTO admins (api_key) VALUES ($1) ON CONFLICT (api_key) DO NOTHING`, 
        [adminApiKey]
      );
    }
    
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
  }
}

// Clean up expired files
async function cleanupExpiredFiles() {
  try {
    const result = await pool.query('DELETE FROM files WHERE expires_at < NOW()');
    console.log(`Cleaned up ${result.rowCount} expired files`);
  } catch (error) {
    console.error('Error cleaning up expired files:', error);
  }
}

// Schedule cleanup every day
setInterval(cleanupExpiredFiles, 24 * 60 * 60 * 1000);

module.exports = {
  query: (text, params) => pool.query(text, params),
  initializeDatabase,
  cleanupExpiredFiles
};
