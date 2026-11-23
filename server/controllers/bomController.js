import { collections } from '../services/dbStore.js';
import { logAudit } from '../services/workflowEngine.js';

export const getBOMs = async (req, res) => {
  try {
    const boms = await collections.boms.find({});
    return res.json({ success: true, count: boms.length, data: boms });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const createBOM = async (req, res) => {
  try {
    const { productCode, productName, version, components, baseQuantity } = req.body;
    if (!productCode || !components || components.length === 0) {
      return res.status(400).json({ success: false, message: 'Product code and components list are required.' });
    }

    const bomNumber = `BOM-${productCode}-${Date.now().toString().slice(-4)}`;
    let totalBomCost = 0;

    const validatedComponents = components.map(comp => {
      const scrap = Number(comp.scrapPercentage || 0);
      const scrapMultiplier = 1 + (scrap / 100);
      const totalCost = Number(comp.quantity) * Number(comp.unitCost) * scrapMultiplier;
      totalBomCost += totalCost;

      return {
        materialCode: comp.materialCode,
        materialName: comp.materialName,
        materialType: comp.materialType || 'RM',
        quantity: Number(comp.quantity),
        uom: comp.uom || 'PCS',
        scrapPercentage: scrap,
        unitCost: Number(comp.unitCost),
        totalCost: Math.round(totalCost * 100) / 100
      };
    });

    const newBOM = await collections.boms.create({
      bomNumber,
      productCode,
      productName: productName || productCode,
      version: version || '1.0',
      status: 'Active',
      baseQuantity: Number(baseQuantity || 1),
      components: validatedComponents,
      totalBomCost: Math.round(totalBomCost * 100) / 100,
      validFrom: new Date().toISOString(),
      approvedBy: req.user?.fullName || 'Plant Head'
    });

    // Update Product standard cost & bomId
    await collections.products.updateOne(
      { productCode },
      { standardCost: Math.round(totalBomCost * 100) / 100, bomId: bomNumber }
    );

    await logAudit(req.user, 'BOM_CREATE', 'Bill of Materials (BOM)', bomNumber, `Created BOM for ${productCode} with ${components.length} components. Total cost: ₹${Math.round(totalBomCost)}`, req);

    return res.status(201).json({ success: true, data: newBOM });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
