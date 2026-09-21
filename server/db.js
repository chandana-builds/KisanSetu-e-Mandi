import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, 'database.sqlite');
const db = new Database(dbPath);

db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

export function initDatabase() {
  // 1. Users Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      mobile TEXT UNIQUE NOT NULL,
      village TEXT,
      district TEXT,
      aadhaar_last4 TEXT,
      role TEXT NOT NULL CHECK(role IN ('farmer', 'officer')),
      password TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // 2. Bookings / Tokens Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS bookings (
      id TEXT PRIMARY KEY,
      token_number TEXT UNIQUE NOT NULL,
      user_id TEXT,
      farmer_name TEXT NOT NULL,
      mobile TEXT NOT NULL,
      village TEXT,
      district TEXT,
      aadhaar_last4 TEXT,
      center_id TEXT NOT NULL,
      center_name TEXT NOT NULL,
      crop TEXT NOT NULL,
      crop_id TEXT NOT NULL,
      quantity REAL NOT NULL,
      quantity_kg REAL NOT NULL,
      unit TEXT DEFAULT 'Quintals',
      booking_date TEXT NOT NULL,
      time_slot TEXT NOT NULL,
      time_slot_id TEXT,
      status TEXT NOT NULL DEFAULT 'Booked',
      quality_moisture REAL,
      quality_grade TEXT,
      msp_per_quintal REAL NOT NULL,
      total_pmt REAL NOT NULL,
      payment_utr TEXT,
      serving_counter TEXT,
      estimated_turn TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
    );
  `);

  // 3. SMS Notifications Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS sms_notifications (
      id TEXT PRIMARY KEY,
      token_number TEXT,
      recipient TEXT NOT NULL,
      sender TEXT DEFAULT 'GOI-KRISHI',
      title TEXT NOT NULL,
      body TEXT NOT NULL,
      timestamp TEXT NOT NULL,
      is_read INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  seedDefaultOfficer();
}

function seedDefaultOfficer() {
  // Only ensure one standard Mandi Officer account exists for administrative login
  const officer = db.prepare("SELECT * FROM users WHERE role = 'officer'").get();
  if (!officer) {
    db.prepare(`
      INSERT INTO users (id, name, mobile, village, district, aadhaar_last4, role, password)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      'usr-officer-default',
      'Mandi Officer Incharge',
      '9988776655',
      'Central Mandi Complex',
      'District HQ',
      '0001',
      'officer',
      'admin123'
    );
    console.log('Seeded default Mandi Officer account: 9988776655 / admin123');
  }
}

export default db;
