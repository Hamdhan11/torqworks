import { collections } from '../services/dbStore.js';
import { WorkflowEngine, logAudit, triggerNotification } from '../services/workflowEngine.js';

export const getProductionOrders = async (req, res) => {
  try {
    const orders = await collections.productionOrders.find({});
    return res.json({ success: true, count: orders.length, data: orders });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const createProductionOrder = async (req, res) => {
  try {
    const { salesOrderNumber, productCode, quantityToProduce, dueDate, shift } = req.body;
    if (!productCode || !quantityToProduce) {
      return res.status(400).json({ success: false, message: 'Product code and quantity are required.' });
    }

    const product = await collections.products.findOne({ productCode });
    if (!product) {
      return res.status(404).json({ success: false, message: `Product ${productCode} not found in master.` });
    }

    // Check BOM existence
    const bom = await collections.boms.findOne({ productCode, status: 'Active' });
    if (!bom) {
      return res.status(400).json({ success: false, message: `No active BOM found for product ${productCode}. BOM verification required.` });
    }

    const productionOrderNumber = `PO-MFG-${Math.floor(1000 + Math.random() * 9000)}`;

    const newOrder = await collections.productionOrders.create({
      productionOrderNumber,
      salesOrderNumber: salesOrderNumber || `SO-INTERNAL-${Date.now().toString().slice(-4)}`,
      productCode,
      productName: product.name,
      quantityToProduce: Number(quantityToProduce),
      completedQuantity: 0,
      scrappedQuantity: 0,
      startDate: new Date().toISOString(),
      dueDate: dueDate || new Date(Date.now() + 10 * 86400000).toISOString(),
      currentStage: 'Rim', // Starting stage of automotive wheel manufacturing
      status: 'Created',
      assignedWorkCentre: 'WC-RIM-FORMING',
      assignedMachine: 'MCH-RIM-ROLL-01',
      shift: shift || 'Shift A (Morning)',
      stageHistory: [],
      actualCostAccumulated: 0
    });

    await logAudit(
      req.user,
      'PRODUCTION_ORDER_CREATE',
      'Production Planning (PP)',
      productionOrderNumber,
      `Created order for ${quantityToProduce} units of ${product.name}`,
      req
    );

    await triggerNotification(
      'APPROVAL_REQUEST',
      `Production Order Created: ${productionOrderNumber}`,
      `Order created for ${quantityToProduce} units of ${product.name}. Awaiting BOM & MRP release.`,
      'info',
      '/production/orders'
    );

    return res.status(201).json({ success: true, data: newOrder });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const releaseProductionOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await collections.productionOrders.findById(id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Production order not found.' });
    }

    // Verify BOM and allocate stock
    const bom = await collections.boms.findOne({ productCode: order.productCode, status: 'Active' });
    if (bom) {
      for (const comp of bom.components || []) {
        const requiredQty = comp.quantity * order.quantityToProduce;
        const mat = await collections.materials.findOne({ materialCode: comp.materialCode });
        if (mat) {
          await collections.materials.updateOne(
            { materialCode: comp.materialCode },
            { 
              allocatedStock: (mat.allocatedStock || 0) + requiredQty,
              availableStock: Math.max(0, mat.currentStock - ((mat.allocatedStock || 0) + requiredQty))
            }
          );
        }
      }
    }

    const updated = await collections.productionOrders.findByIdAndUpdate(id, {
      status: 'Released'
    });

    await logAudit(
      req.user,
      'ORDER_RELEASE',
      'Production Planning (PP)',
      order.productionOrderNumber,
      `Order released to shop floor. Material requirements allocated.`,
      req
    );

    return res.json({ success: true, message: `Order ${order.productionOrderNumber} released.`, data: updated });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const advanceProductionStage = async (req, res) => {
  try {
    const { id } = req.params;
    const stageData = req.body;
    const updated = await WorkflowEngine.advanceProductionStage(id, stageData, req.user, req);
    return res.json({ success: true, message: `Stage advanced successfully.`, data: updated });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

// Work Centres & Routings
export const getWorkCentres = async (req, res) => {
  try {
    const wcs = await collections.workCentres.find({});
    return res.json({ success: true, count: wcs.length, data: wcs });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getRoutings = async (req, res) => {
  try {
    const routings = await collections.routings.find({});
    return res.json({ success: true, count: routings.length, data: routings });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
