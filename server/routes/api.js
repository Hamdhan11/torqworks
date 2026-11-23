import express from 'express';
import { authenticate, authorizeRoles } from '../middleware/auth.js';
import * as authCtrl from '../controllers/authController.js';
import * as salesCtrl from '../controllers/salesController.js';
import * as materialCtrl from '../controllers/materialController.js';
import * as bomCtrl from '../controllers/bomController.js';
import * as prodCtrl from '../controllers/productionController.js';
import * as mrpCtrl from '../controllers/mrpController.js';
import * as procCtrl from '../controllers/procurementController.js';
import * as qualityCtrl from '../controllers/qualityController.js';
import * as maintCtrl from '../controllers/maintenanceController.js';
import * as finCtrl from '../controllers/financeController.js';
import * as adminCtrl from '../controllers/adminController.js';
import * as aiCtrl from '../controllers/aiController.js';
import { collections } from '../services/dbStore.js';

const router = express.Router();

// 1. Authentication & Role Switcher
router.post('/auth/login', authCtrl.login);
router.post('/auth/switch-role', authCtrl.switchRoleDemo);
router.get('/auth/me', authenticate, authCtrl.getCurrentUser);

// 2. Sales Management (SD) - Restricted to Sales, Finance, Plant Head & Super Admin
const salesAuth = authorizeRoles('Plant Head', 'Sales Manager', 'Finance Manager');
router.get('/sales/customers', authenticate, salesAuth, salesCtrl.getCustomers);
router.post('/sales/customers', authenticate, salesAuth, salesCtrl.createCustomer);
router.get('/sales/orders', authenticate, salesAuth, salesCtrl.getSalesOrders);
router.post('/sales/orders', authenticate, salesAuth, salesCtrl.createSalesOrder);
router.put('/sales/orders/:id/status', authenticate, salesAuth, salesCtrl.updateOrderStatus);

// 3. Materials Management (MM) - Restricted to Stores, Production, Procurement, Plant Head & Super Admin
const matAuth = authorizeRoles('Plant Head', 'Store Manager', 'Production Manager', 'Procurement Manager');
router.get('/materials', authenticate, matAuth, materialCtrl.getMaterials);
router.post('/materials', authenticate, matAuth, materialCtrl.createMaterial);
router.post('/materials/transfer', authenticate, matAuth, materialCtrl.transferStock);
router.get('/materials/movements', authenticate, matAuth, materialCtrl.getStockMovements);

// 4. Bill of Materials (BOM) - Restricted to Production, Stores, Plant Head & Super Admin
const bomAuth = authorizeRoles('Plant Head', 'Production Manager', 'Store Manager');
router.get('/bom', authenticate, bomAuth, bomCtrl.getBOMs);
router.post('/bom', authenticate, bomAuth, bomCtrl.createBOM);

// 5. Production Planning (PP) - Restricted to Production, Operator, Quality, Plant Head & Super Admin
const prodAuth = authorizeRoles('Plant Head', 'Production Manager', 'Operator', 'Quality Manager');
router.get('/production/orders', authenticate, prodAuth, prodCtrl.getProductionOrders);
router.post('/production/orders', authenticate, prodAuth, prodCtrl.createProductionOrder);
router.put('/production/orders/:id/release', authenticate, prodAuth, prodCtrl.releaseProductionOrder);
router.put('/production/orders/:id/advance', authenticate, prodAuth, prodCtrl.advanceProductionStage);
router.get('/production/workcentres', authenticate, prodAuth, prodCtrl.getWorkCentres);
router.get('/production/routings', authenticate, prodAuth, prodCtrl.getRoutings);

// 6. Material Requirement Planning (MRP) - Restricted to Production, Stores, Procurement, Plant Head & Super Admin
const mrpAuth = authorizeRoles('Plant Head', 'Production Manager', 'Store Manager', 'Procurement Manager');
router.get('/mrp/run', authenticate, mrpAuth, mrpCtrl.runMRP);
router.post('/mrp/run', authenticate, mrpAuth, mrpCtrl.runMRP);
router.post('/mrp/generate-pr', authenticate, mrpAuth, mrpCtrl.createPRFromMRP);

// 7. Procurement (PR, PO, GRN, Vendors) - Restricted to Procurement, Stores, Plant Head & Super Admin
const procAuth = authorizeRoles('Plant Head', 'Procurement Manager', 'Store Manager');
router.get('/procurement/prs', authenticate, procAuth, procCtrl.getPRs);
router.post('/procurement/prs', authenticate, procAuth, procCtrl.createPR);
router.put('/procurement/prs/:id/approve', authenticate, procAuth, procCtrl.approvePR);
router.get('/procurement/pos', authenticate, procAuth, procCtrl.getPOs);
router.post('/procurement/pos/from-pr', authenticate, procAuth, procCtrl.createPOFromPR);
router.get('/procurement/grns', authenticate, procAuth, procCtrl.getGRNs);
router.post('/procurement/grns', authenticate, procAuth, procCtrl.createGRN);
router.get('/procurement/vendors', authenticate, procAuth, procCtrl.getVendors);

// 8. Quality Management (QM) - Restricted to Quality, Production, Plant Head & Super Admin
const qualAuth = authorizeRoles('Plant Head', 'Quality Manager', 'Production Manager');
router.get('/quality/inspections', authenticate, qualAuth, qualityCtrl.getInspections);
router.post('/quality/inspections', authenticate, qualAuth, qualityCtrl.createInspection);

// 9. Plant Maintenance (PM) - Restricted to Maintenance, Plant Head & Super Admin
const maintAuth = authorizeRoles('Plant Head', 'Maintenance Manager');
router.get('/maintenance/machines', authenticate, maintAuth, maintCtrl.getMachines);
router.put('/maintenance/machines/:id/status', authenticate, maintAuth, maintCtrl.updateMachineStatus);
router.get('/maintenance/orders', authenticate, maintAuth, maintCtrl.getMaintenanceOrders);
router.post('/maintenance/orders', authenticate, maintAuth, maintCtrl.createMaintenanceOrder);
router.get('/maintenance/downtime', authenticate, maintAuth, maintCtrl.getDowntimeLogs);
router.post('/maintenance/downtime', authenticate, maintAuth, maintCtrl.logDowntime);

// 10. Finance & Controlling (FI/CO) - Restricted to Finance, Plant Head & Super Admin
const finAuth = authorizeRoles('Plant Head', 'Finance Manager');
router.get('/finance/cost-centres', authenticate, finAuth, finCtrl.getCostCentres);
router.get('/finance/profit-centres', authenticate, finAuth, finCtrl.getProfitCentres);
router.get('/finance/cost-records', authenticate, finAuth, finCtrl.getCostRecords);
router.get('/finance/analysis', authenticate, finAuth, finCtrl.getManufacturingCostAnalysis);

// 11. Administration & Basis Monitoring - Restricted to Plant Head & Super Admin
const adminAuth = authorizeRoles('Plant Head');
router.get('/admin/users', authenticate, adminAuth, adminCtrl.getUsers);
router.get('/admin/logs', authenticate, adminAuth, adminCtrl.getSystemLogs);
router.get('/admin/health', authenticate, adminAuth, adminCtrl.getSystemHealth);
router.post('/admin/report', authenticate, adminAuth, adminCtrl.runCustomReport);

// 12. AI-Assisted Intelligence - Restricted to Plant Head, Production, Maintenance & Super Admin
const aiAuth = authorizeRoles('Plant Head', 'Production Manager', 'Maintenance Manager');
router.get('/ai/summary', authenticate, aiAuth, aiCtrl.getExecutiveAISummary);
router.get('/ai/shortages', authenticate, aiAuth, aiCtrl.getShortagePredictions);
router.get('/ai/delays', authenticate, aiAuth, aiCtrl.getDelayPredictions);
router.get('/ai/machines', authenticate, aiAuth, aiCtrl.getMachinePredictions);
router.get('/ai/bottlenecks', authenticate, aiAuth, aiCtrl.getBottlenecks);
router.get('/ai/overruns', authenticate, aiAuth, aiCtrl.getCostOverruns);

// 13. Notifications - Accessible to all authenticated users
router.get('/notifications', authenticate, async (req, res) => {
  try {
    const list = await collections.notifications.find({});
    return res.json({ success: true, count: list.length, data: list.reverse() });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

router.put('/notifications/:id/read', authenticate, async (req, res) => {
  try {
    await collections.notifications.findByIdAndUpdate(req.params.id, { isRead: true });
    return res.json({ success: true, message: 'Notification marked as read.' });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// 14. Master End-to-End Workflow Pipeline Status
const pipelineAuth = authorizeRoles('Plant Head', 'Sales Manager', 'Production Manager', 'Procurement Manager', 'Quality Manager');
router.get('/workflow/pipeline', authenticate, pipelineAuth, async (req, res) => {
  try {
    const salesOrders = await collections.salesOrders.find({});
    const prodOrders = await collections.productionOrders.find({});
    const prs = await collections.purchaseRequisitions.find({});
    const pos = await collections.purchaseOrders.find({});
    const grns = await collections.grns.find({});
    const qcs = await collections.qualityInspections.find({});

    return res.json({
      success: true,
      data: {
        totalSalesOrders: salesOrders.length,
        totalProductionOrders: prodOrders.length,
        pendingPRs: prs.filter(p => p.status === 'Pending Approval').length,
        activePOs: pos.filter(p => p.status === 'Submitted' || p.status === 'Partially Received').length,
        recentGRNs: grns.length,
        totalQCInspections: qcs.length,
        stageBreakdown: {
          Rim: prodOrders.filter(o => o.currentStage === 'Rim').length,
          Disc: prodOrders.filter(o => o.currentStage === 'Disc').length,
          Assembly: prodOrders.filter(o => o.currentStage === 'Assembly').length,
          HeatTreatment: prodOrders.filter(o => o.currentStage === 'Heat Treatment').length,
          Painting: prodOrders.filter(o => o.currentStage === 'Painting').length,
          QualityInspection: prodOrders.filter(o => o.currentStage === 'Quality Inspection').length,
          Packing: prodOrders.filter(o => o.currentStage === 'Packing').length,
          Completed: prodOrders.filter(o => o.currentStage === 'Completed').length
        }
      }
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
