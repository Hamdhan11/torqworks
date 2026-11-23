import { collections } from '../services/dbStore.js';
import { logAudit, triggerNotification } from '../services/workflowEngine.js';

// Materials CRUD
export const getMaterials = async (req, res) => {
  try {
    const { type } = req.query;
    const query = type ? { materialType: type } : {};
    const materials = await collections.materials.find(query);
    return res.json({ success: true, count: materials.length, data: materials });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const createMaterial = async (req, res) => {
  try {
    const { materialCode, name, description, materialType, uom, unitPrice, safetyStock, reorderPoint, leadTimeDays, storageLocation } = req.body;
    if (!materialCode || !name || !materialType) {
      return res.status(400).json({ success: false, message: 'Material Code, Name and Type are required.' });
    }

    const existing = await collections.materials.findOne({ materialCode });
    if (existing) {
      return res.status(400).json({ success: false, message: `Material ${materialCode} already exists.` });
    }

    const newMaterial = await collections.materials.create({
      materialCode,
      name,
      description,
      materialType,
      uom: uom || 'PCS',
      unitPrice: Number(unitPrice || 0),
      currentStock: 0,
      allocatedStock: 0,
      availableStock: 0,
      safetyStock: Number(safetyStock || 50),
      reorderPoint: Number(reorderPoint || 100),
      leadTimeDays: Number(leadTimeDays || 7),
      storageLocation: storageLocation || 'RMS1-A01',
      standardCost: Number(unitPrice || 0),
      inspectionRequired: true
    });

    await logAudit(req.user, 'MATERIAL_CREATE', 'Materials Management (MM)', materialCode, `Created material ${name}`, req);

    return res.status(201).json({ success: true, data: newMaterial });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Stock Adjustment & Transfer (SAP 311 Movement)
export const transferStock = async (req, res) => {
  try {
    const { materialCode, quantity, fromLocation, toLocation, reason } = req.body;
    const qty = Number(quantity);

    if (!materialCode || !qty || qty <= 0 || !toLocation) {
      return res.status(400).json({ success: false, message: 'Valid material, quantity, and destination are required.' });
    }

    const material = await collections.materials.findOne({ materialCode });
    if (!material) {
      return res.status(404).json({ success: false, message: `Material ${materialCode} not found.` });
    }

    if (material.availableStock < qty) {
      return res.status(400).json({
        success: false,
        message: `Insufficient stock for transfer. Available: ${material.availableStock} ${material.uom}, Requested: ${qty} ${material.uom}`
      });
    }

    // Record Stock Movement 311 (Plant Transfer)
    const movementNumber = `MVT-${Date.now().toString().slice(-6)}`;
    await collections.stockMovements.create({
      movementNumber,
      movementType: '311-Plant Stock Transfer',
      materialCode,
      materialName: material.name,
      quantity: qty,
      uom: material.uom,
      fromLocation: fromLocation || material.storageLocation,
      toLocation,
      referenceDocument: reason || 'Internal Plant Transfer',
      movementDate: new Date().toISOString(),
      performedBy: req.user?.username || 'storemgr'
    });

    // Update material location
    await collections.materials.updateOne(
      { materialCode },
      { storageLocation: toLocation }
    );

    await logAudit(
      req.user,
      'STOCK_TRANSFER',
      'Materials Management (MM)',
      movementNumber,
      `Transferred ${qty} ${material.uom} of ${materialCode} from ${fromLocation || material.storageLocation} to ${toLocation}`,
      req
    );

    return res.json({
      success: true,
      message: `Successfully transferred ${qty} ${material.uom} to ${toLocation}`,
      movementNumber
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Stock Movements History
export const getStockMovements = async (req, res) => {
  try {
    const movements = await collections.stockMovements.find({});
    return res.json({ success: true, count: movements.length, data: movements });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
