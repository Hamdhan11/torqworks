import { collections } from '../services/dbStore.js';
import { getDBStatus } from '../config/db.js';
import os from 'os';

export const getUsers = async (req, res) => {
  try {
    const users = await collections.users.find({});
    const sanitized = users.map(u => ({
      id: u._id,
      username: u.username,
      fullName: u.fullName,
      email: u.email,
      role: u.role,
      department: u.department,
      employeeId: u.employeeId,
      isActive: u.isActive,
      lastLogin: u.lastLogin,
      createdAt: u.createdAt
    }));
    return res.json({ success: true, count: sanitized.length, data: sanitized });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getSystemLogs = async (req, res) => {
  try {
    const logs = await collections.auditLogs.find({});
    // Return latest logs first
    const sorted = [...logs].reverse();
    return res.json({ success: true, count: sorted.length, data: sorted });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getSystemHealth = async (req, res) => {
  try {
    const dbStatus = getDBStatus();
    const uptimeSec = process.uptime();
    const memUsage = process.memoryUsage();

    const counts = {
      users: await collections.users.countDocuments(),
      materials: await collections.materials.countDocuments(),
      salesOrders: await collections.salesOrders.countDocuments(),
      productionOrders: await collections.productionOrders.countDocuments(),
      machines: await collections.machines.countDocuments(),
      auditLogs: await collections.auditLogs.countDocuments()
    };

    return res.json({
      success: true,
      data: {
        serverTime: new Date().toISOString(),
        database: dbStatus,
        uptimeSeconds: Math.floor(uptimeSec),
        memoryMB: Math.round(memUsage.heapUsed / 1024 / 1024),
        osPlatform: os.platform(),
        cpus: os.cpus().length,
        systemLoad: '0.24 (Optimal)',
        sapBasisStatus: {
          dispatcher: 'ACTIVE / GREEN',
          enqueueService: 'SYNCHRONIZED',
          backgroundWorkProcesses: '8 / 8 IDLE',
          dialogWorkProcesses: '16 / 16 READY'
        },
        collectionRecords: counts
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ABAP-inspired Custom Query / Report Engine
export const runCustomReport = async (req, res) => {
  try {
    const { reportType } = req.body;
    let reportData = [];
    let reportTitle = '';

    if (reportType === 'MATERIAL_STOCK_VALUATION') {
      reportTitle = 'SAP MB52-Inspired: Total Plant Material Stock Valuation';
      const materials = await collections.materials.find({});
      reportData = materials.map(m => ({
        materialCode: m.materialCode,
        description: m.name,
        type: m.materialType,
        uom: m.uom,
        currentStock: m.currentStock,
        standardCost: m.standardCost,
        totalValuation: Math.round(m.currentStock * m.standardCost),
        location: m.storageLocation
      }));
    } else if (reportType === 'MACHINE_OEE_DOWNTIME') {
      reportTitle = 'SAP PM-Inspired: Plant Machine Availability & OEE Summary';
      const machines = await collections.machines.find({});
      reportData = machines.map(m => ({
        machineCode: m.machineCode,
        name: m.name,
        workCentre: m.workCentreCode,
        healthScore: `${m.healthScore}%`,
        status: m.status,
        mtbf: `${m.mtbfHours} hrs`,
        mttr: `${m.mttrHours} hrs`,
        totalDowntime: `${m.totalDowntimeHours} hrs`
      }));
    } else {
      reportTitle = 'SAP COOIS-Inspired: Production Order Stage Execution Status';
      const orders = await collections.productionOrders.find({});
      reportData = orders.map(o => ({
        productionOrderNumber: o.productionOrderNumber,
        product: o.productName,
        targetQty: o.quantityToProduce,
        completedQty: o.completedQuantity,
        currentStage: o.currentStage,
        status: o.status,
        workCentre: o.assignedWorkCentre,
        dueDate: o.dueDate?.split('T')[0]
      }));
    }

    return res.json({
      success: true,
      reportTitle,
      recordCount: reportData.length,
      data: reportData
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
