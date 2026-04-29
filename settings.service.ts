import sqlite3 from 'sqlite3';
import { promisify } from 'util';

const db = new sqlite3.Database('settings.db');
const run = promisify(db.run.bind(db));
const get = promisify(db.get.bind(db));

export class SettingsService {
  static async init() {
    await run(`CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY, 
      value TEXT
    )`);
  }

  static async set(key: string, value: any) {
    await run('INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)', [key, JSON.stringify(value)]);
  }

  static async get(key: string) {
    const row: any = await get('SELECT value FROM settings WHERE key = ?', [key]);
    return row ? JSON.parse(row.value) : null;
  }
}