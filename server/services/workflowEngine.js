import { collections } from './dbStore.js';

// Helper to log audit trail
export const logAudit = async (user, action, module, documentNumber, details, req) => {
  const ipAddress = req?.ip || req?.connection?.remoteAddress || '127.0.0.1';
  const username = user?.username || 'SYSTEM';
  await collections.auditLogs.create({
    user: username,
    action,
    module,
    documentNumber,
    details,
    timestamp: new Date().toISOString(),
    ipAddress
  });
};

// Helper to trigger system notifications
export const triggerNotification = async (type, title, message, severity, link = '') => {
  return await collections.notifications.create({
    type,
    title,
    message,
    severity,
    isRead: false,
    link
  });
};

// 7-Stage Manufacturing Flow
export const MANUFACTURING_STAGES = [
  'Rim',
  'Disc',
  'Assembly',
  'Heat Treatment',
  'Painting',
  'Quality Inspection',
  'Packing'
];

export const WorkflowEngine = {
  // Validate and advance production order stage
  advanceProductionStage: async (productionOrderId, stageData, user, req) => {
    const order = await collections.productionOrders.findById(productionOrderId);
    if (!order) throw new Error(`Production Order ${productionOrderId} not found.`);

    if (order.status !== 'In Progress' && order.status !== 'Released') {
      throw new Error(`Cannot advance production order in '${order.status}' status. Must be 'Released' or 'In Progress'.`);
    }

    const currentStage = order.currentStage;
    const currentIdx = MANUFACTURING_STAGES.indexOf(currentStage);

    if (currentIdx === -1) {
      throw new Error(`Invalid current stage: ${currentStage}`);
    }

    const isFinalStage = currentIdx === MANUFACTURING_STAGES.length - 1;
    const nextStage = isFinalStage ? 'Completed' : MANUFACTURING_STAGES[currentIdx + 1];

    const acceptedQty = Number(stageData.acceptedQty || order.quantityToProduce);
    const rejectedQty = Number(stageData.rejectedQty || 0);
    const notes = stageData.notes || `Advanced from ${currentStage} to ${nextStage}`;
    const operator = user?.fullName || 'Shop Floor Operator';

    // Update stage history
    const stageHistory = order.stageHistory || [];
    stageHistory.push({
      stage: currentStage,
      enteredAt: order.updatedAt || new Date().toISOString(),
      completedAt: new Date().toISOString(),
      operator,
      acceptedQty,
      rejectedQty,
      notes
    });

    const updatePayload = {
      currentStage: nextStage,
      status: isFinalStage ? 'Technical Complete (TECO)' : 'In Progress',
      completedQuantity: isFinalStage ? acceptedQty : order.completedQuantity,
      scrappedQuantity: (order.scrappedQuantity || 0) + rejectedQty,
      stageHistory
    };

    // If final stage, record FERT stock increase and prompt Final QC
    if (isFinalStage) {
      // Find material record for finished good
      const fertMaterial = await collections.materials.findOne({ materialCode: order.productCode });
      if (fertMaterial) {
        await collections.materials.updateOne(
          { materialCode: order.productCode },
          { 
            currentStock: fertMaterial.currentStock + acceptedQty,
            availableStock: fertMaterial.availableStock + acceptedQty 
          }
        );
      }

      // Log Stock Movement: 101 - GR from Production Order
      await collections.stockMovements.create({
        movementNumber: `MVT-${Date.now().toString().slice(-6)}`,
        movementType: '101-GR from Production Order',
        materialCode: order.productCode,
        materialName: order.productName,
        quantity: acceptedQty,
        uom: 'PCS',
        fromLocation: 'Shop Floor Assembly',
        toLocation: 'Finished Goods Warehouse - FGW1',
        referenceDocument: order.productionOrderNumber,
        movementDate: new Date().toISOString(),
        performedBy: user?.username || 'prodmgr'
      });

      // Update Sales Order status to 'Quality Approved' or 'In Production'
      if (order.salesOrderNumber) {
        await collections.salesOrders.updateOne(
          { orderNumber: order.salesOrderNumber },
          { orderStatus: 'Quality Approved' }
        );
      }

      await triggerNotification(
        'QUALITY_REJECTION',
        `Production Order ${order.productionOrderNumber} Completed`,
        `Finished production of ${acceptedQty} units of ${order.productName}. Material moved to Finished Goods (FERT).`,
        'success',
        '/production/orders'
      );
    }

    const updated = await collections.productionOrders.findByIdAndUpdate(productionOrderId, updatePayload);

    await logAudit(
      user,
      'STAGE_ADVANCE',
      'Production Planning (PP)',
      order.productionOrderNumber,
      `Advanced stage from ${currentStage} to ${nextStage}. Accepted: ${acceptedQty}, Scrapped: ${rejectedQty}`,
      req
    );

    return updated;
  },

  // Create PR automatically when shortage is detected
  createPRFromShortage: async (shortageItems, requestedBy, department) => {
    const prNumber = `PR-AUTO-${Date.now().toString().slice(-5)}`;
    let totalAmount = 0;

    const prItems = shortageItems.map(item => {
      const lineCost = item.shortageQuantity * item.unitPrice;
      totalAmount += lineCost;
      return {
        materialCode: item.materialCode,
        materialName: item.name,
        requiredQuantity: item.shortageQuantity,
        uom: item.uom,
        estimatedUnitCost: item.unitPrice,
        estimatedTotalCost: lineCost,
        reasonForRequisition: `Automated MRP Shortage Replenishment (Safety shortfall: ${item.shortageQuantity} ${item.uom})`
      };
    });

    const newPR = await collections.purchaseRequisitions.create({
      prNumber,
      requestedBy: requestedBy || 'MRP Automated Engine',
      department: department || 'Production Planning & Control',
      requiredByDate: new Date(Date.now() + 7 * 86400000).toISOString(),
      items: prItems,
      totalAmount,
      status: 'Pending Approval'
    });

    await triggerNotification(
      'SHORTAGE_ALERT',
      `Auto PR Created: ${prNumber}`,
      `Generated Purchase Requisition for ${prItems.length} materials totaling ₹${totalAmount.toLocaleString()} to resolve stockout risk.`,
      'warning',
      '/procurement/requisitions'
    );

    return newPR;
  }
};
