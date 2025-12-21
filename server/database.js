const sqlite3 = require('sqlite3').verbose();
const { Pool } = require('pg');
const path = require('path');

// Check if DATABASE_URL is set (PostgreSQL) or use SQLite
const DATABASE_URL = process.env.DATABASE_URL;
const USE_POSTGRES = !!DATABASE_URL;

let pgPool = null;
let sqliteDb = null;
const DB_PATH = path.join(__dirname, 'chat.db');

// Initialize database
async function initDatabase() {
  if (USE_POSTGRES) {
    try {
      // Parse DATABASE_URL and create connection pool
      pgPool = new Pool({
        connectionString: DATABASE_URL,
        ssl: {
          rejectUnauthorized: false // Required for Supabase
        }
      });

      // Test connection
      const client = await pgPool.connect();
      console.log('✅ Connected to PostgreSQL database (Supabase)');

      // Create messages table if it doesn't exist
      await client.query(`
        CREATE TABLE IF NOT EXISTS messages (
          id SERIAL PRIMARY KEY,
          message TEXT,
          username TEXT NOT NULL,
          "userId" TEXT NOT NULL,
          timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          "imageUrl" TEXT,
          "messageType" TEXT DEFAULT 'text'
        )
      `);

      // Add missing columns if they don't exist (for existing databases)
      try {
        await client.query(`ALTER TABLE messages ADD COLUMN "imageUrl" TEXT`);
      } catch (err) {
        // Column already exists, ignore
      }

      try {
        await client.query(`ALTER TABLE messages ADD COLUMN "messageType" TEXT DEFAULT 'text'`);
      } catch (err) {
        // Column already exists, ignore
      }

      client.release();
      console.log('✅ Messages table ready (PostgreSQL)');
      return pgPool;
    } catch (err) {
      console.error('❌ Error initializing PostgreSQL:', err.message);
      throw err;
    }
  } else {
    // Fallback to SQLite for local development
    return new Promise((resolve, reject) => {
      const db = new sqlite3.Database(DB_PATH, (err) => {
        if (err) {
          console.error('Error opening SQLite database:', err.message);
          reject(err);
          return;
        }
        console.log('Connected to SQLite database (local dev)');
      });

      // Create messages table if it doesn't exist
      db.run(`
        CREATE TABLE IF NOT EXISTS messages (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          message TEXT,
          username TEXT NOT NULL,
          userId TEXT NOT NULL,
          timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          imageUrl TEXT,
          messageType TEXT DEFAULT 'text'
        )
      `, (err) => {
        if (err) {
          console.error('Error creating table:', err.message);
          reject(err);
          return;
        }
        
        // Add missing columns if they don't exist (for existing databases)
        db.run(`ALTER TABLE messages ADD COLUMN imageUrl TEXT`, () => {});
        db.run(`ALTER TABLE messages ADD COLUMN messageType TEXT DEFAULT 'text'`, () => {});
        
        console.log('Messages table ready (SQLite)');
        sqliteDb = db;
        resolve(db);
      });
    });
  }
}

// Save a message to the database
async function saveMessage(db, messageData) {
  const { message, username, userId, timestamp, imageUrl, messageType } = messageData;
  const timestampValue = timestamp || new Date().toISOString();

  if (USE_POSTGRES) {
    try {
      const result = await db.query(
        `INSERT INTO messages (message, username, "userId", timestamp, "imageUrl", "messageType") 
         VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`,
        [
          message || null,
          username,
          userId,
          timestampValue,
          imageUrl || null,
          messageType || 'text'
        ]
      );
      return { id: result.rows[0].id, ...messageData };
    } catch (err) {
      console.error('Error saving message (PostgreSQL):', err.message);
      throw err;
    }
  } else {
    // SQLite
    return new Promise((resolve, reject) => {
      const sql = `INSERT INTO messages (message, username, userId, timestamp, imageUrl, messageType) VALUES (?, ?, ?, ?, ?, ?)`;
      
      db.run(sql, [
        message || null,
        username,
        userId,
        timestampValue,
        imageUrl || null,
        messageType || 'text'
      ], function(err) {
        if (err) {
          console.error('Error saving message (SQLite):', err.message);
          reject(err);
        } else {
          resolve({ id: this.lastID, ...messageData });
        }
      });
    });
  }
}

// Get message history
async function getMessages(db, limit = 100) {
  if (USE_POSTGRES) {
    try {
      const result = await db.query(
        `SELECT * FROM messages ORDER BY timestamp DESC LIMIT $1`,
        [limit]
      );
      // Reverse to get chronological order (oldest first)
      return result.rows.reverse();
    } catch (err) {
      console.error('Error fetching messages (PostgreSQL):', err.message);
      throw err;
    }
  } else {
    // SQLite
    return new Promise((resolve, reject) => {
      const sql = `SELECT * FROM messages ORDER BY timestamp DESC LIMIT ?`;
      
      db.all(sql, [limit], (err, rows) => {
        if (err) {
          console.error('Error fetching messages (SQLite):', err.message);
          reject(err);
        } else {
          // Reverse to get chronological order (oldest first)
          resolve(rows.reverse());
        }
      });
    });
  }
}

// Get messages by user ID
async function getMessagesByUserId(db, userId, limit = 100) {
  if (USE_POSTGRES) {
    try {
      const result = await db.query(
        `SELECT * FROM messages WHERE "userId" = $1 ORDER BY timestamp DESC LIMIT $2`,
        [userId, limit]
      );
      return result.rows.reverse();
    } catch (err) {
      console.error('Error fetching user messages (PostgreSQL):', err.message);
      throw err;
    }
  } else {
    // SQLite
    return new Promise((resolve, reject) => {
      const sql = `SELECT * FROM messages WHERE userId = ? ORDER BY timestamp DESC LIMIT ?`;
      
      db.all(sql, [userId, limit], (err, rows) => {
        if (err) {
          console.error('Error fetching user messages (SQLite):', err.message);
          reject(err);
        } else {
          resolve(rows.reverse());
        }
      });
    });
  }
}

// Delete old messages (optional cleanup function)
async function deleteOldMessages(db, daysOld = 30) {
  if (USE_POSTGRES) {
    try {
      const result = await db.query(
        `DELETE FROM messages WHERE timestamp < NOW() - INTERVAL '${daysOld} days'`
      );
      console.log(`Deleted ${result.rowCount} old messages`);
      return result.rowCount;
    } catch (err) {
      console.error('Error deleting old messages (PostgreSQL):', err.message);
      throw err;
    }
  } else {
    // SQLite
    return new Promise((resolve, reject) => {
      const sql = `DELETE FROM messages WHERE timestamp < datetime('now', '-' || ? || ' days')`;
      
      db.run(sql, [daysOld], function(err) {
        if (err) {
          console.error('Error deleting old messages (SQLite):', err.message);
          reject(err);
        } else {
          console.log(`Deleted ${this.changes} old messages`);
          resolve(this.changes);
        }
      });
    });
  }
}

module.exports = {
  initDatabase,
  saveMessage,
  getMessages,
  getMessagesByUserId,
  deleteOldMessages,
  DB_PATH
};
