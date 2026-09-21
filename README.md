# KisanSetu (कृषि सेतु)
### Smart Mandi Slot Booking & Real-Time Queue Management Platform



## 🌐 Live Deployment
The platform is deployed and live at:
👉 **[https://kisansetu-e-mandi.onrender.com/](https://kisansetu-e-mandi.onrender.com/)**

---

## 📖 Overview
**KisanSetu (कृषि सेतु)** is a digitized agricultural procurement management platform designed for the **Smart India Hackathon (SIH)**. It targets congestion, crop spoilage, and administrative delays across Primary Agricultural Credit Societies (PACS) and Agriculture Produce Market Committees (APMCs / Mandis).

By replacing unorganized truck queues with pre-booked arrival tokens, digital weighbridge checks, Fair Average Quality (FAQ) compliance inspection, and instant Direct Benefit Transfer (DBT) payment generation, KisanSetu delivers a transparent experience for farmers and procurement staff.

---

## 🌟 Core Modules

### 🌾 1. Farmer Portal & Slot Reservation
- **Advance Slot Scheduling**: Select crop, quantity (Quintals/kg), choose a procurement center, and reserve time slots to eliminate overnight waiting lines.
- **Digital Mandi Gate Pass**: Instant token pass with a scannable QR verification code, printable format, and WhatsApp sharing.
- **Live Queue & Wait Time Monitor**: Real-time counter showing "People Ahead in Line" and dynamic arrival estimate.
- **6-Stage Lifecycle Tracking**:
  $$\text{Booked} \longrightarrow \text{Arrived at Gate} \longrightarrow \text{Quality Check} \longrightarrow \text{Accepted} \longrightarrow \text{Payment Pending} \longrightarrow \text{DBT Disbursed}$$
- **Multilingual Voice Assist**: Text-to-speech engine providing status announcements in **English**, **हिन्दी (Hindi)**, and **తెలుగు (Telugu)**.
- **Automated Mobile Notifications**: Instant SMS simulated updates for booking verification, arrival calls, and payment transfers.

### 🏢 2. Mandi Officer Administration
- **Live Yard Pipeline Management**: Progress tokens seamlessly through gate check-in, moisture grading, weight record, and payment disbursement.
- **Moisture & Quality Inspection**: Fair Average Quality (FAQ) threshold verification against government procurement benchmarks.
- **Direct Benefit Transfer (DBT)**: Automatic calculation of Minimum Support Price (MSP) with generated PFMS/DBT transaction references.
- **Integrated Yard PA Chime**: Text-to-speech public announcement summoning token numbers directly to weigh counters.

### 📺 3. Public Mandi Yard Display (Gate TV)
- High-contrast, large-format display interface designed for gate LED boards and waiting lounge screens.
- Displays live counter allocations, tokens currently being serviced, next-in-line schedule, and news announcements.

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    KisanSetu Platform                       │
└──────────────────────────────┬──────────────────────────────┘
                               │
            ┌──────────────────┴──────────────────┐
            ▼                                     ▼
   [ Farmer Portal / TV ]               [ Mandi Officer Ops ]
   - Slot Booking                       - Gate Verification
   - Digital Gate Pass & QR             - Moisture / Quality Check
   - Multilingual Voice Assist          - MSP & DBT Settlement
            │                                     │
            └──────────────────┬──────────────────┘
                               │
            ┌──────────────────┴──────────────────┐
            │       Express.js Unified API        │
            │   (Authentication, Tokens, Queue)   │
            └──────────────────┬──────────────────┘
                               ▼
            ┌─────────────────────────────────────┐
            │        SQLite Database (WAL)        │
            │   (Users, Bookings, SMS Audit Log)  │
            └─────────────────────────────────────┘
```

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 19, Vite, Tailwind CSS, Lucide React, HTML5 SpeechSynthesis |
| **Backend** | Node.js, Express.js |
| **Database** | SQLite 3 (`better-sqlite3`) with WAL journal mode |
| **Utilities** | QRCode generation, Canvas Confetti, BroadcastChannel API |
| **Hosting & Deployment** | Render (Unified Single-Service Full-Stack Web Service) |

---

## 💻 Local Development Setup

### Prerequisites
- Node.js (v18 or newer)
- npm

### 1. Clone the Repository
```bash
git clone https://github.com/chandana-builds/KisanSetu-e-Mandi.git
cd KisanSetu-e-Mandi
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Run Development Servers
Start backend API:
```bash
node server/index.js
```

In another terminal, start frontend:
```bash
npm run dev
```

### 4. Build & Run Single-Service Production Bundle
```bash
npm run build
npm start
```
*Access the full application at `http://localhost:5000`*

---

## 📄 License
Developed for the Smart India Hackathon (SIH). Open for academic and review purposes.
