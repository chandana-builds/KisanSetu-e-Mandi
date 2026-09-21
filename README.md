# KisanSetu (कृषि सेतु) - Smart Mandi Slot Booking & Real-Time Queue Management Platform

[![Smart India Hackathon](https://img.shields.io/badge/SIH-Hackathon-orange.svg)](https://sih.gov.in/)
[![React](https://img.shields.io/badge/React-19-blue.svg)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-6-purple.svg)](https://vitejs.dev/)
[![SQLite](https://img.shields.io/badge/SQLite-3-green.svg)](https://www.sqlite.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-teal.svg)](https://tailwindcss.com/)

A modern, production-ready web platform developed for the **Smart India Hackathon (SIH)** to eliminate physical gate congestion, crop degradation, and payment opacity at agricultural procurement centers (Mandis/PPCs).

---

## 🌟 Key Features

### 🌾 1. Farmer Portal
- **Slot Pre-Booking**: Select crop, quantity (Quintals/kg), nearest procurement center, and reserve preferred arrival time windows to eliminate overnight queueing.
- **Dynamic Digital Token Pass**: Unique token number with scannable QR code for rapid gate weighbridge verification, WhatsApp sharing, and printable receipt.
- **Real-Time Queue Tracking**: Live counter showing "People Ahead in Queue", dynamic estimated wait time, and a 6-step lifecycle progress tracker:
  $$\text{Booked} \longrightarrow \text{Arrived} \longrightarrow \text{Quality Check} \longrightarrow \text{Accepted} \longrightarrow \text{Payment Pending} \longrightarrow \text{Paid}$$
- **Rural Accessibility Voice Assist**: Text-to-speech engine delivering audio status announcements in English, हिन्दी (Hindi), and తెలుగు (Telugu).
- **Automated Telecom SMS Alerts**: Automated simulated SMS gateway sending mobile alerts from `GOI-KRISHI`.

### 🏢 2. Mandi Officer / Admin Dashboard
- **Live Yard Queue Management**: Fast-forward workflow advancement (`Gate Check-In` $\to$ `Quality Check` $\to$ `Accept/Reject` $\to$ `DBT Disburse`).
- **Moisture & Quality Inspection**: Digital moisture sensor grading checking produce against Government FAQ thresholds (≤17% moisture for paddy).
- **Direct Benefit Transfer (DBT) Disbursement**: Automated Minimum Support Price (MSP) payout with generated PFMS UTR references.
- **Loudspeaker Public Address (PA) System**: Voice chime calling tokens to specific weigh counters.

### 📺 3. Public Mandi Yard TV Display
- High-visibility big-screen signage view for installation at procurement center gates.
- "Now Serving at Counters", "Upcoming Next in Line", digital clock, and live scrolling government announcement marquee.

---

## 🛠️ Technology Stack
- **Frontend**: React 19, Vite, Tailwind CSS, Lucide Icons, Canvas-Confetti, QRCode.
- **Backend**: Express.js REST API.
- **Database**: SQLite (`better-sqlite3`) for persistent relational storage.
- **Multi-Tab Sync**: HTML5 `BroadcastChannel` API + WebSocket/HTTP polling.

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Backend API Server
```bash
node server/index.js
```
The Express + SQLite API will start at `http://localhost:5000`.

### 3. Start Frontend Dev Server
```bash
npm run dev
```
Open `http://localhost:5173` in your browser.

---

## 👥 Default Mandi Officer Credentials
- **Mobile**: `9988776655`
- **Password**: `admin123`

*(Farmers can sign up directly using their mobile number and name).*
