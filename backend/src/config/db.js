// SQLite database adapter — drop-in replacement for the pg Pool interface.
// Uses the 'sqlite' wrapper (async/await) + 'sqlite3' driver.
// No installation required — data stored in backend/database/lakshyamaarg.db

const path = require('path');
const { open } = require('sqlite');
const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');

const DB_PATH = path.join(__dirname, '../../database/lakshyamaarg.db');

let _db = null;

// Open (or create) the SQLite file and run the schema if needed
async function getDb() {
  if (_db) return _db;

  _db = await open({ filename: DB_PATH, driver: sqlite3.Database });
  await _db.run('PRAGMA journal_mode = WAL;');
  await _db.run('PRAGMA foreign_keys = ON;');

  // Auto-initialise schema + seed data on first run
  const initPath = path.join(__dirname, '../../database/init.sql');
  if (fs.existsSync(initPath)) {
    const sql = fs.readFileSync(initPath, 'utf8');
    // Split on statement boundaries, skip empty lines
    const statements = sql.split(';').map(s => s.trim()).filter(Boolean);
    for (const stmt of statements) {
      try { await _db.run(stmt); } catch (_) { /* ignore "already exists" */ }
    }
  }

  console.log('✅ SQLite database ready at', DB_PATH);
  return _db;
}

// pg-compatible Pool shim: pool.query(sql, params?) → { rows: [...] }
// Translates $1,$2,… placeholders → ? 
const pool = {
  query: async (sql, params = []) => {
    const db = await getDb();
    // Convert PostgreSQL $1 $2 … placeholders to SQLite ?
    const sqliteSQL = sql.replace(/\$\d+/g, '?');
    const upper = sqliteSQL.trim().toUpperCase();

    if (upper.startsWith('SELECT') || upper.startsWith('WITH')) {
      const rows = await db.all(sqliteSQL, params);
      return { rows };
    } else if (
      upper.startsWith('INSERT') && upper.includes('RETURNING')
    ) {
      // Handle INSERT ... RETURNING by removing RETURNING clause then fetching
      const withoutReturning = sqliteSQL.replace(/\s+RETURNING\s+.*/is, '');
      await db.run(withoutReturning, params);
      const lastId = (await db.get('SELECT last_insert_rowid() AS id')).id;
      // Determine table name from INSERT INTO <table>
      const tableMatch = withoutReturning.match(/INSERT\s+(?:OR\s+IGNORE\s+)?INTO\s+(\w+)/i);
      if (tableMatch) {
        const row = await db.get(`SELECT * FROM ${tableMatch[1]} WHERE rowid = ?`, [lastId]);
        return { rows: row ? [row] : [] };
      }
      return { rows: [{ id: lastId }] };
    } else {
      const result = await db.run(sqliteSQL, params);
      return { rows: [], rowCount: result.changes };
    }
  }
};

module.exports = pool;
