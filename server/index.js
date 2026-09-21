import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import db, { initDatabase } from './db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distPath = path.join(__dirname, '..', 'dist');

initDatabase();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// ---------------- AUTHENTICATION APIS ----------------

// Register new user (Farmer or Mandi Officer)
app.post('/api/auth/register', (req, res) => {
  try {
    const { name, mobile, village, district, aadhaar_last4, role, password } = req.body;

    if (!name || !mobile || !password || !role) {
      return res.status(400).json({ error: 'Name, mobile, password, and role are required' });
    }

    const cleanMobile = mobile.trim();
    const existing = db.prepare('SELECT * FROM users WHERE mobile = ?').get(cleanMobile);
    if (existing) {
      return res.status(400).json({ error: 'A user with this mobile number already exists. Please log in.' });
    }

    const id = `usr-${Date.now()}`;
    const insert = db.prepare(`
      INSERT INTO users (id, name, mobile, village, district, aadhaar_last4, role, password)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    insert.run(id, name.trim(), cleanMobile, village ? village.trim() : '', district ? district.trim() : '', aadhaar_last4 ? aadhaar_last4.trim() : '', role, password);

    const newUser = db.prepare('SELECT id, name, mobile, village, district, aadhaar_last4, role, created_at FROM users WHERE id = ?').get(id);
    res.status(201).json({ success: true, user: newUser });
  } catch (err) {
    console.error('Register error', err);
    res.status(500).json({ error: err.message });
  }
});

// Login
app.post('/api/auth/login', (req, res) => {
  try {
    const { mobile, password } = req.body;

    if (!mobile || !password) {
      return res.status(400).json({ error: 'Mobile number and password required' });
    }

    const user = db.prepare('SELECT * FROM users WHERE mobile = ?').get(mobile.trim());
    if (!user) {
      return res.status(401).json({ error: 'User not found. Please register first.' });
    }

    if (user.password !== password) {
      return res.status(401).json({ error: 'Incorrect password. Please try again.' });
    }

    const { password: _, ...userWithoutPass } = user;
    res.json({ success: true, user: userWithoutPass });
  } catch (err) {
    console.error('Login error', err);
    res.status(500).json({ error: err.message });
  }
});

// Get users list (internal/admin)
app.get('/api/users', (req, res) => {
  try {
    const users = db.prepare('SELECT id, name, mobile, village, district, aadhaar_last4, role, created_at FROM users ORDER BY created_at DESC').all();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ---------------- BOOKING & QUEUE APIS ----------------

// Get bookings (filtered by user if requested, or all for officer)
app.get('/api/bookings', (req, res) => {
  try {
    const { userId, mobile } = req.query;
    let query = 'SELECT * FROM bookings';
    const params = [];

    if (userId) {
      query += ' WHERE user_id = ?';
      params.push(userId);
    } else if (mobile) {
      query += ' WHERE mobile = ?';
      params.push(mobile);
    }

    query += ' ORDER BY created_at DESC';

    const rows = db.prepare(query).all(...params);

    const formatted = rows.map(r => ({
      id: r.id,
      tokenNumber: r.token_number,
      userId: r.user_id,
      farmerName: r.farmer_name,
      mobile: r.mobile,
      village: r.village,
      district: r.district,
      aadhaarLast4: r.aadhaar_last4,
      centerId: r.center_id,
      centerName: r.center_name,
      crop: r.crop,
      cropId: r.crop_id,
      quantity: r.quantity,
      quantityKg: r.quantity_kg,
      unit: r.unit,
      bookingDate: r.booking_date,
      timeSlot: r.time_slot,
      timeSlotId: r.time_slot_id,
      status: r.status,
      qualityMoisture: r.quality_moisture,
      qualityGrade: r.quality_grade,
      mspPerQuintal: r.msp_per_quintal,
      totalPmt: r.total_pmt,
      paymentUtr: r.payment_utr,
      servingCounter: r.serving_counter,
      estimatedTurn: r.estimated_turn,
      createdAt: r.created_at
    }));

    res.json(formatted);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create booking (stores real farmer data)
app.post('/api/bookings', (req, res) => {
  try {
    const b = req.body;
    const count = db.prepare('SELECT COUNT(*) as c FROM bookings').get().c;
    const prefix = b.centerId === 'pc-01' ? 'A' : 'T';
    const tokenNumber = b.tokenNumber || `${prefix}${100 + count + 1}`;
    const id = b.id || `tok-${Date.now()}`;

    const insert = db.prepare(`
      INSERT INTO bookings (
        id, token_number, user_id, farmer_name, mobile, village, district,
        aadhaar_last4, center_id, center_name, crop, crop_id, quantity,
        quantity_kg, unit, booking_date, time_slot, time_slot_id, status,
        quality_moisture, quality_grade, msp_per_quintal, total_pmt,
        payment_utr, serving_counter, estimated_turn
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    insert.run(
      id,
      tokenNumber,
      b.userId || null,
      b.farmerName,
      b.mobile,
      b.village || '',
      b.district || '',
      b.aadhaarLast4 || '',
      b.centerId,
      b.centerName,
      b.crop,
      b.cropId,
      Number(b.quantity),
      Number(b.quantity) * 100,
      'Quintals',
      b.bookingDate,
      b.timeSlot,
      b.timeSlotId || 'slot-1',
      'Booked',
      null,
      null,
      Number(b.mspPerQuintal || 2300),
      Number(b.quantity) * Number(b.mspPerQuintal || 2300),
      null,
      null,
      '11:30 AM'
    );

    // Auto SMS notification
    const smsId = `sms-${Date.now()}`;
    db.prepare(`
      INSERT INTO sms_notifications (id, token_number, recipient, sender, title, body, timestamp, is_read)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      smsId,
      tokenNumber,
      b.mobile,
      'GOI-KRISHI',
      'Slot Booking Confirmed',
      `Namaste ${b.farmerName}! Your token ${tokenNumber} is confirmed for ${b.crop} (${b.quantity} Quintals) at ${b.centerName}. Scheduled slot: ${b.timeSlot}.`,
      new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      0
    );

    res.status(201).json({ success: true, tokenNumber, id });
  } catch (err) {
    console.error('Create booking error', err);
    res.status(500).json({ error: err.message });
  }
});

// Update booking status
app.patch('/api/bookings/:id/status', (req, res) => {
  try {
    const { id } = req.params;
    const { status, qualityMoisture, qualityGrade, paymentUtr, servingCounter, rejectionReason } = req.body;

    const current = db.prepare('SELECT * FROM bookings WHERE id = ?').get(id);
    if (!current) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    const updates = [];
    const params = [];

    if (status !== undefined) { updates.push('status = ?'); params.push(status); }
    if (qualityMoisture !== undefined) { updates.push('quality_moisture = ?'); params.push(qualityMoisture); }
    if (qualityGrade !== undefined) { updates.push('quality_grade = ?'); params.push(qualityGrade); }
    if (paymentUtr !== undefined) { updates.push('payment_utr = ?'); params.push(paymentUtr); }
    if (servingCounter !== undefined) { updates.push('serving_counter = ?'); params.push(servingCounter); }

    if (updates.length > 0) {
      params.push(id);
      db.prepare(`UPDATE bookings SET ${updates.join(', ')} WHERE id = ?`).run(...params);
    }

    // Auto SMS
    let smsTitle = `Status: ${status}`;
    let smsBody = `Token ${current.token_number}: Updated to ${status}`;

    if (status === 'Arrived') {
      smsTitle = 'Gate Check-In Verified';
      smsBody = `Token ${current.token_number}: Gate entry verified. Your vehicle is queued for weighbridge inspection.`;
    } else if (status === 'Quality Check') {
      smsTitle = 'Quality Inspection Underway';
      smsBody = `Token ${current.token_number}: Sample collected for moisture test at inspection counter.`;
    } else if (status === 'Accepted') {
      smsTitle = 'Crop Accepted & Weighed';
      smsBody = `Token ${current.token_number}: Produce APPROVED (${qualityGrade || 'Grade A'}). Net Weight: ${current.quantity} Qtl. Total payable: ₹${current.total_pmt?.toLocaleString('en-IN')}.`;
    } else if (status === 'Paid') {
      smsTitle = 'DBT Payment Disbursed!';
      smsBody = `Token ${current.token_number}: MSP payment of ₹${current.total_pmt?.toLocaleString('en-IN')} credited via DBT. Reference UTR: ${paymentUtr || 'DBT-GOI-SUCCESS'}.`;
    } else if (status === 'Rejected') {
      smsTitle = 'Quality Disapproval Notice';
      smsBody = `Token ${current.token_number}: Moisture exceeded FAQ limit (${qualityMoisture}%). Reason: ${rejectionReason || 'High moisture'}.`;
    }

    db.prepare(`
      INSERT INTO sms_notifications (id, token_number, recipient, sender, title, body, timestamp, is_read)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      `sms-${Date.now()}`,
      current.token_number,
      current.mobile,
      'GOI-KRISHI',
      smsTitle,
      smsBody,
      new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      0
    );

    res.json({ success: true });
  } catch (err) {
    console.error('Update status error', err);
    res.status(500).json({ error: err.message });
  }
});

// ---------------- SMS APIS ----------------

app.get('/api/sms', (req, res) => {
  try {
    const { mobile } = req.query;
    let query = 'SELECT * FROM sms_notifications';
    const params = [];

    if (mobile) {
      query += ' WHERE recipient = ?';
      params.push(mobile);
    }

    query += ' ORDER BY created_at DESC';

    const rows = db.prepare(query).all(...params);
    const formatted = rows.map(r => ({
      id: r.id,
      tokenNumber: r.token_number,
      recipient: r.recipient,
      sender: r.sender,
      title: r.title,
      body: r.body,
      timestamp: r.timestamp,
      read: Boolean(r.is_read)
    }));
    res.json(formatted);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Reset Database API (cleans out all data)
app.post('/api/reset', (req, res) => {
  try {
    db.exec(`
      DELETE FROM sms_notifications;
      DELETE FROM bookings;
      DELETE FROM users WHERE role = 'farmer';
    `);
    res.json({ success: true, message: 'Cleaned database successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Serve Vite production build assets when available
app.use(express.static(distPath));

// SPA catch-all handler for Express 5 (any non-API GET request serves index.html)
app.use((req, res) => {
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ error: 'API endpoint not found' });
  }
  const indexFile = path.join(distPath, 'index.html');
  res.sendFile(indexFile, (err) => {
    if (err) {
      res.status(200).send('KisanSetu API is running. (Frontend dist not built yet)');
    }
  });
});

app.listen(PORT, () => {
  console.log(`KisanSetu Express API server running at http://localhost:${PORT}`);
});
