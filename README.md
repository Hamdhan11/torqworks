# TORQWORKS ERP
## Next-Gen AI Manufacturing Execution System for Automotive Industries (Wheels India Edition)

Enterprise-grade Manufacturing ERP web application inspired by **SAP S/4HANA**, **SAP Fiori**, and modern Industry 4.0 platforms, specifically engineered for automotive component and wheel manufacturing plants.

---

## 🚀 Key Highlights & Architecture

- **Clean MVC Architecture & Scalable Monorepo**: Node.js/Express.js backend with React.js & Tailwind CSS frontend.
- **Enterprise Resilience Dual-Mode Database**:
  - Connects to **MongoDB / Mongoose** when a MongoDB instance is detected (`process.env.MONGODB_URI`).
  - Seamlessly falls back to an **Embedded Enterprise Persistence Storage Engine** (`server/data/smart_erp_store.json`) when offline, ensuring immediate, zero-configuration out-of-the-box execution.
- **Complete End-to-End Interconnected Workflow**:
  ```
  Customer Order (SD)
    ↓
  Production Planning (PP) & BOM Verification
    ↓
  MRP Engine Net Requirement Calculation
    ↓
  Shortage Detection & Safety Stock Alert
    ↓
  Purchase Requisition (PR)
    ↓
  Plant Head Approval
    ↓
  Purchase Order (PO) to Vendor
    ↓
  Goods Receipt Note (GRN) & Auto Inward Stock Update
    ↓
  Auto-Triggered Incoming QC Inspection Lot (QM)
    ↓
  Production Order Release (Material Allocation)
    ↓
  7-Stage Shop Floor Manufacturing:
  [Rim Line] → [Disc Press] → [Robotic MIG Assembly] → [T6 Heat Treat] → [CED Paint Line] → [Quality Runout QC] → [Automated Packing]
    ↓
  Finished Goods (FERT) Warehouse Booking & TECO Status
    ↓
  Dispatch & Delivery Tracking
    ↓
  Standard vs Actual Cost Variance Analysis (FI/CO)
    ↓
  AI Predictive Intelligence & Management Analytics
  ```
- **AI-Assisted Intelligence Engine**:
  - Material Shortage & Stockout Forecast (Days until stockout, lead times)
  - Production Delay & Delivery Risk Prediction
  - Machine Failure & Preventive Health Degradation (MTBF / MTTR analysis)
  - Shop Floor Bottleneck Congestion Detection
  - Cost Overrun & Scrap Surge Prediction
  - Architecture ready for Scikit-learn / Python ML models
- **10 Role-Based User Access Profiles**:
  - Super Admin, Plant Head, Sales Manager, Production Manager, Store Manager, Procurement Manager, Quality Manager, Maintenance Manager, Finance Manager, Operator.
  - Interactive **1-Click Role Switcher** to easily simulate any user role in real time.
- **SAP Basis Technical Administration**:
  - Real-time Dispatcher / Enqueue / Memory status
  - Audit Trail & Transaction Logging
  - ABAP-inspired Custom Query Report Generator (MB52 Stock Valuation, PM Machine OEE, COOIS Order Execution)

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 18, Tailwind CSS, Lucide React, Recharts, Vite |
| **Backend** | Node.js, Express.js, JWT, bcryptjs, Morgan, CORS |
| **Database** | MongoDB, Mongoose, High-performance Embedded File Persistence |
| **Architecture** | REST API, Controller-Service-Store Pattern, Role-based Middleware |

---

## 🏃 Quick Start Instructions

### 1. Start the Integrated Application Server
From the root directory:
```bash
npm run server
```
The server will boot on `http://localhost:5000` and serve both the API endpoints and the full interactive React ERP frontend.

### 2. (Optional) Run Client with Vite Live-Reload Dev Server
In a separate terminal:
```bash
npm run client
```
Access the client with HMR on `http://localhost:5173`.

### 3. Run the Automated 27-Step Integration Test Suite
```bash
node server/test/integrationTest.js
```

---

## 🔑 Demo Login Credentials

You can sign in with any of the pre-configured departmental users or use the **1-Click Demo Login** buttons on the login screen or top navigation bar:

| Role | Username | Password | Department | Permitted Modules (Strict RBAC) |
|---|---|---|---|---|
| **Super Admin** | `admin` | `password123` | Executive Management | Full Access to All 13 Modules |
| **Plant Head** | `planthead` | `password123` | Plant Operations | All Operations & Analytics Modules |
| **Sales Manager** | `salesmgr` | `password123` | Sales & Distribution (SD) | Sales, Dashboard, Workflow Pipeline |
| **Production Manager** | `prodmgr` | `password123` | Production Planning (PP) | Production, BOM, MRP, Materials, Quality, AI Hub |
| **Store Manager** | `storemgr` | `password123` | Materials Management (MM) | Materials & Stock, BOM, MRP, Procurement |
| **Procurement Manager** | `procmgr` | `password123` | Purchasing (MM-PUR) | Procurement Hub, Materials, MRP, Workflow |
| **Quality Manager** | `qualitymgr` | `password123` | Quality Management (QM) | Quality Inspections, Production, Workflow |
| **Maintenance Manager** | `maintmgr` | `password123` | Plant Maintenance (PM) | Machine Master & PM, AI Predictive Hub |
| **Finance Manager** | `financemgr` | `password123` | Finance & Controlling (FI/CO) | Finance & Costing, Dashboard, Sales |
| **Operator** | `operator1` | `password123` | Shop Floor - Rim Line | Production Planning Only (Restricted from all other modules) |
