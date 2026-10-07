# Aamys CRM - Maintenance Work Order & Operations System

A comprehensive enterprise plant maintenance and asset management system modeled after standard industrial workflows (SAP PM IW21 / IW31 / IW41 / WCM / MCI8).

---

## 🌟 Key Features

- **Maintenance Work Orders (IW31 / IW32 / IW38)**:
  - Supports PM01 (Corrective), PM02 (Preventive), PM03 (Breakdown / Urgent), PM04 (Statutory Recertification).
  - Multi-operation labor scheduling with internal work centers (`MECH_01`, `ELEC_01`, `INST_01`, `CIVIL_01`).
  - Bill of Materials (BOM) & Spare Parts Reservations with Goods Issue (Movement Type 261).
  - Cost Settlement to SAP CO-OM Cost Centers (`CC-4100`, `CC-3200`, `CC-1150`).
- **Master Dossier View Page (`WorkOrderDetailView`)**:
  - Full-screen view with KPI ribbon, 5 detailed sub-tabs (Operations, BOM Reservations, Costing Variance, Safety LOTO, History Audit).
  - Clean, spacious Light & Dark mode support.
- **Maintenance Notifications & Defects (IW21 / IW28)**:
  - Asset failure logging, breakdown urgency tracking, and one-click conversion into Work Orders.
- **Permit to Work (WCM / PTW)**:
  - Safety Lockout/Tagout (LOTO) and atmospheric gas clearance certificates.
- **Preventive Maintenance (IP01 / IP10)**:
  - Time- and performance-based maintenance schedules with automated order call generation.
- **Printable Job Cards**:
  - Clean shift handover print templates with QR codes, safety checklists, and sign-off blocks.

---

## 📁 Repository Structure

```text
├── backup_data.txt            # Complete text backup of all initial master & demo data
├── public/                    # Static public assets
├── src/
│   ├── components/            # UI Views (Workbench, Detail Dossier, Modals, TopBar, Sidebar)
│   ├── data/
│   │   ├── mockMasterData.js  # Plants, Functional Locations, Equipment, Work Centers
│   │   └── backup_sample_data.txt # Data backup copy
│   ├── utils/
│   │   └── pmUtils.js         # Costing calculations, status badges, date formatters
│   ├── App.jsx                # Main application state & transaction routing
│   ├── index.css              # Core design tokens, light/dark theme variables & layout
│   └── main.jsx               # React entrypoint
├── index.html                 # App shell
└── vite.config.js             # Vite development server configuration
```

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 3. Production Build
```bash
npm run build
```

---

## 🍃 Future Roadmap: Connecting MongoDB Atlas

When connecting MongoDB Atlas to persist work orders, notifications, and master data:

1. **Copy Environment Template**:
   ```bash
   cp .env.example .env
   ```
2. **Retrieve Connection String from MongoDB Atlas**:
   - In MongoDB Atlas: **Database** > **Connect** > **Drivers** (Node.js).
   - Paste connection string into `.env`:
     ```env
     MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.your_cluster.mongodb.net/aamys_crm?retryWrites=true&w=majority
     ```
3. **Whitelist IP Address**:
   - In MongoDB Atlas: **Network Access** > **Add IP Address** (allow your development IP or `0.0.0.0/0` during initial dev).
4. **Backend Architecture**:
   - Add an Express.js backend (or serverless functions) using `mongoose` or official `mongodb` driver.
   - Schemas: `WorkOrder`, `Notification`, `Equipment`, `FunctionalLocation`, `PermitToWork`.
