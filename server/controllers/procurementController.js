import { collections } from '../services/dbStore.js';
import { logAudit, triggerNotification } from '../services/workflowEngine.js';

// Purchase Requisitions (PR)
export const getPRs = async (req, res) => {
  try {
    const prs = await collections.purchaseRequisitions.find({});
    return res.json({ success: true, count: prs.length, data: prs });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const createPR = async (req, res) => {
  try {
    const { department, requiredByDate, items } = req.body;
    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: 'Requisition items are required.' });
    }

    const prNumber = `PR-2026-${Math.floor(100 + Math.random() * 900)}`;
    let totalAmount = 0;

    const validatedItems = items.map(item => {
      const lineCost = Number(item.requiredQuantity) * Number(item.estimatedUnitCost || 0);
      totalAmount += lineCost;
      return {
        materialCode: item.materialCode,
        materialName: item.materialName || item.materialCode,
        requiredQuantity: Number(item.requiredQuantity),
        uom: item.uom || 'PCS',
        estimatedUnitCost: Number(item.estimatedUnitCost || 0),
        estimatedTotalCost: lineCost,
        reasonForRequisition: item.reasonForRequisition || 'Stock replenishment'
      };
    });

    const newPR = await collections.purchaseRequisitions.create({
      prNumber,
      requestedBy: req.user?.fullName || 'Procurement User',
      department: department || req.user?.department || 'Stores & Purchasing',
      requiredByDate: requiredByDate || new Date(Date.now() + 7 * 86400000).toISOString(),
      items: validatedItems,
      totalAmount,
      status: 'Pending Approval'
    });

    await logAudit(req.user, 'PR_CREATE', 'Procurement (MM-PUR)', prNumber, `Created PR for ₹${totalAmount.toLocaleString()}`, req);

    await triggerNotification(
      'APPROVAL_REQUEST',
      `New Requisition Awaiting Approval: ${prNumber}`,
      `PR submitted for ₹${totalAmount.toLocaleString()} with ${validatedItems.length} items.`,
      'warning',
      '/procurement/requisitions'
    );

    return res.status(201).json({ success: true, data: newPR });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const approvePR = async (req, res) => {
  try {
    const { id } = req.params;
    const { action } = req.body; // 'Approved' or 'Rejected'

    const pr = await collections.purchaseRequisitions.findById(id);
    if (!pr) return res.status(404).json({ success: false, message: 'PR not found' });

    const newStatus = action === 'Approved' ? 'Approved' : 'Rejected';

    const updated = await collections.purchaseRequisitions.findByIdAndUpdate(id, {
      status: newStatus,
      approvedBy: req.user?.fullName || 'Plant Head',
      approvalDate: new Date().toISOString()
    });

    await logAudit(req.user, 'PR_APPROVAL', 'Procurement (MM-PUR)', pr.prNumber, `${newStatus} by ${req.user?.fullName}`, req);

    return res.json({ success: true, message: `PR ${pr.prNumber} marked as ${newStatus}.`, data: updated });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Purchase Orders (PO)
export const getPOs = async (req, res) => {
  try {
    const pos = await collections.purchaseOrders.find({});
    return res.json({ success: true, count: pos.length, data: pos });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const createPOFromPR = async (req, res) => {
  try {
    const { prId, vendorCode, expectedDeliveryDate } = req.body;
    const pr = await collections.purchaseRequisitions.findById(prId);
    if (!pr) return res.status(404).json({ success: false, message: 'Requisition not found.' });

    if (pr.status !== 'Approved') {
      return res.status(400).json({ success: false, message: 'Requisition must be approved before PO generation.' });
    }

    const vendor = await collections.vendors.findOne({ vendorCode });
    if (!vendor) return res.status(404).json({ success: false, message: `Vendor ${vendorCode} not found.` });

    const poNumber = `PO-2026-${Math.floor(500 + Math.random() * 500)}`;
    let totalAmount = 0;

    const poItems = pr.items.map(item => {
      const lineTotal = item.requiredQuantity * item.estimatedUnitCost;
      totalAmount += lineTotal;
      return {
        materialCode: item.materialCode,
        materialName: item.materialName,
        orderedQuantity: item.requiredQuantity,
        receivedQuantity: 0,
        unitPrice: item.estimatedUnitCost,
        lineTotal
      };
    });

    const newPO = await collections.purchaseOrders.create({
      poNumber,
      prNumber: pr.prNumber,
      vendorCode: vendor.vendorCode,
      vendorName: vendor.companyName,
      orderDate: new Date().toISOString(),
      expectedDeliveryDate: expectedDeliveryDate || new Date(Date.now() + 6 * 86400000).toISOString(),
      items: poItems,
      totalAmount,
      status: 'Submitted'
    });

    // Update PR status
    await collections.purchaseRequisitions.findByIdAndUpdate(prId, { status: 'PO Created' });

    await logAudit(req.user, 'PO_CREATE', 'Procurement (MM-PUR)', poNumber, `Created PO for vendor ${vendor.companyName}. Total ₹${totalAmount.toLocaleString()}`, req);

    return res.status(201).json({ success: true, data: newPO });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Goods Receipt Note (GRN) & Automatic QC Trigger
export const getGRNs = async (req, res) => {
  try {
    const grns = await collections.grns.find({});
    return res.json({ success: true, count: grns.length, data: grns });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const createGRN = async (req, res) => {
  try {
    const { poNumber, invoiceNumber, items, storageLocation } = req.body;
    const po = await collections.purchaseOrders.findOne({ poNumber });
    if (!po) return res.status(404).json({ success: false, message: `PO ${poNumber} not found.` });

    const grnNumber = `GRN-2026-${Math.floor(300 + Math.random() * 700)}`;
    const validatedItems = [];

    for (const item of items) {
      const recQty = Number(item.receivedQuantity);
      const accQty = Number(item.acceptedQuantity || recQty);
      const rejQty = Number(item.rejectedQuantity || 0);
      const batchNumber = `BATCH-${item.materialCode}-${Date.now().toString().slice(-4)}`;

      validatedItems.push({
        materialCode: item.materialCode,
        materialName: item.materialName || item.materialCode,
        receivedQuantity: recQty,
        acceptedQuantity: accQty,
        rejectedQuantity: rejQty,
        batchNumber,
        storageLocation: storageLocation || 'RMS1-A01'
      });

      // Update Inventory Stock (only accepted quantity)
      const material = await collections.materials.findOne({ materialCode: item.materialCode });
      if (material) {
        const newStock = material.currentStock + accQty;
        const newAvailable = (material.availableStock || 0) + accQty;
        await collections.materials.updateOne(
          { materialCode: item.materialCode },
          { currentStock: newStock, availableStock: newAvailable }
        );
      }

      // Record Stock Movement 101 - GR from PO
      await collections.stockMovements.create({
        movementNumber: `MVT-${Date.now().toString().slice(-6)}`,
        movementType: '101-GR from PO',
        materialCode: item.materialCode,
        materialName: item.materialName || item.materialCode,
        quantity: accQty,
        uom: material?.uom || 'KG',
        fromLocation: `Vendor: ${po.vendorName}`,
        toLocation: storageLocation || 'RMS1-A01',
        referenceDocument: grnNumber,
        movementDate: new Date().toISOString(),
        performedBy: req.user?.username || 'storemgr'
      });

      // Auto-trigger Incoming Quality Inspection Lot
      await collections.qualityInspections.create({
        inspectionNumber: `QC-INB-${Date.now().toString().slice(-5)}`,
        inspectionType: 'Incoming (GRN)',
        referenceDocument: grnNumber,
        materialOrProductCode: item.materialCode,
        batchNumber,
        sampleSize: Math.max(5, Math.round(recQty * 0.05)),
        inspectionStage: 'Goods Inward Receiving Gate',
        parametersChecked: [
          {
            parameter: 'Certificate of Analysis (COA) Verification',
            nominalValue: 'Standard Chemical & Physical Specs',
            actualReading: 'COA verified and matches mill test certificate',
            result: 'Pass'
          },
          {
            parameter: 'Visual Surface & Packaging Inspection',
            nominalValue: 'Zero rust / oil contamination',
            actualReading: 'Surface clean and protective wrapping intact',
            result: 'Pass'
          }
        ],
        overallResult: 'Accepted',
        defectCategory: 'None',
        inspectorName: req.user?.fullName || 'Incoming QC Specialist',
        inspectionDate: new Date().toISOString()
      });
    }

    const newGRN = await collections.grns.create({
      grnNumber,
      poNumber,
      vendorCode: po.vendorCode,
      vendorName: po.vendorName,
      receiptDate: new Date().toISOString(),
      invoiceNumber: invoiceNumber || `INV-${Math.floor(10000 + Math.random() * 90000)}`,
      items: validatedItems,
      receivedBy: req.user?.fullName || 'Store Manager',
      inspectionStatus: 'QC Passed'
    });

    // Update PO status
    await collections.purchaseOrders.updateOne(
      { poNumber },
      { status: 'Received' }
    );

    await logAudit(req.user, 'GRN_CREATE', 'Procurement (MM-PUR)', grnNumber, `Received GRN for PO ${poNumber}. Stock and Incoming QC updated.`, req);

    await triggerNotification(
      'QUALITY_REJECTION',
      `Goods Received: ${grnNumber}`,
      `Received goods for PO ${poNumber} from ${po.vendorName}. Material stock updated in stores.`,
      'success',
      '/procurement/grn'
    );

    return res.status(201).json({ success: true, data: newGRN });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Vendors
export const getVendors = async (req, res) => {
  try {
    const vendors = await collections.vendors.find({});
    return res.json({ success: true, count: vendors.length, data: vendors });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
