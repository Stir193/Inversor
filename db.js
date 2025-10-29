// db.js - supports PostgreSQL (via DATABASE_URL) or falls back to SQLite
const path = require('path');

if(process.env.DATABASE_URL){
  // Use PostgreSQL
  const { Pool } = require('pg');
  const pool = new Pool({ connectionString: process.env.DATABASE_URL, ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false });

  // Initialize tables if not exist
  (async () => {
    await pool.query(`CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      email TEXT UNIQUE,
      password TEXT
    )`);
    await pool.query(`CREATE TABLE IF NOT EXISTS transactions (
      id SERIAL PRIMARY KEY,
      user_id INTEGER,
      ticker TEXT,
      type TEXT,
      quantity REAL,
      price REAL,
      date TEXT
    )`);
    await pool.query(`CREATE TABLE IF NOT EXISTS prices (
      ticker TEXT PRIMARY KEY,
      price REAL,
      ts INTEGER
    )`);
  })().catch(err=>console.error('DB init error', err));

  // Export a minimal API similar to sqlite3 interface used in the project
  module.exports = {
    query: (text, params) => pool.query(text, params),
    get: (text, params, cb) => {
      pool.query(text, params).then(r => cb(null, r.rows[0])).catch(e => cb(e));
    },
    all: (text, params, cb) => {
      pool.query(text, params).then(r => cb(null, r.rows)).catch(e => cb(e));
    },
    run: (text, params, cb) => {
      pool.query(text, params).then(r => cb && cb(null)).catch(e => cb && cb(e));
    }
  };
} else {
  // Fall back to SQLite (development)
  const sqlite3 = require('sqlite3').verbose();
  const dbPath = path.join(__dirname, '..', '..', 'data.db');
  const db = new sqlite3.Database(dbPath);

  db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE,
      password TEXT
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS transactions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      ticker TEXT,
      type TEXT,
      quantity REAL,
      price REAL,
      date TEXT
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS prices (
      ticker TEXT PRIMARY KEY,
      price REAL,
      ts INTEGER
    )`);
  });

  module.exports = db;
}
