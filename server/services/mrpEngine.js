import { collections } from './dbStore.js';

export const MRPEngine = {
  // Comprehensive MRP Calculation based on Demand & BOM explosion
  calculateMRP: async () => {
    // 1. Get open sales orders and open production orders
    const salesOrders = await collections.salesOrders.find({
      orderStatus: { $in: ['Confirmed', 'Production Scheduled', 'In Production'] }
    });

    const productionOrders = await collections.productionOrders.find({
      status: { $in: ['Created', 'BOM Verified', 'MRP Checked', 'Released', 'In Progress'] }
    });

    const materials = await collections.materials.find({});
    const boms = await collections.boms.find({ status: 'Active' });

    // 2. Aggregate Gross Demand per Finished Good (FERT)
    const demandPerProduct = {};

    for (const so of salesOrders) {
      for (const item of so.items || []) {
        demandPerProduct[item.productCode] = (demandPerProduct[item.productCode] || 0) + (item.orderedQuantity - (item.deliveredQuantity || 0));
      }
    }

    for (const po of productionOrders) {
      if (po.status !== 'Technical Complete (TECO)' && po.status !== 'Closed') {
        demandPerProduct[po.productCode] = (demandPerProduct[po.productCode] || 0) + (po.quantityToProduce - (po.completedQuantity || 0));
      }
    }

    // 3. Explode Demand via BOM to calculate Gross Component Requirements
    const componentRequirements = {};

    for (const [productCode, qty] of Object.entries(demandPerProduct)) {
      const bom = boms.find(b => b.productCode === productCode);
      if (bom) {
        for (const comp of bom.components || []) {
          const scrapMultiplier = 1 + ((comp.scrapPercentage || 0) / 100);
          const reqQty = qty * comp.quantity * scrapMultiplier;

          if (!componentRequirements[comp.materialCode]) {
            componentRequirements[comp.materialCode] = {
              materialCode: comp.materialCode,
              materialName: comp.materialName,
              materialType: comp.materialType,
              uom: comp.uom,
              grossRequirement: 0,
              usedInProducts: []
            };
          }

          componentRequirements[comp.materialCode].grossRequirement += reqQty;
          if (!componentRequirements[comp.materialCode].usedInProducts.includes(productCode)) {
            componentRequirements[comp.materialCode].usedInProducts.push(productCode);
          }
        }
      }
    }

    // 4. Compare with Stock on Hand & Safety Stock to identify Shortages
    const mrpResults = [];
    const shortages = [];

    for (const mat of materials) {
      const grossReq = componentRequirements[mat.materialCode]?.grossRequirement || 0;
      const currentStock = mat.currentStock || 0;
      const allocatedStock = mat.allocatedStock || 0;
      const safetyStock = mat.safetyStock || 0;
      const availableStock = currentStock - allocatedStock;
      
      // Net requirement calculation: Gross Requirement + Safety Stock - Available Stock
      const netRequirement = Math.max(0, (grossReq + safetyStock) - availableStock);
      const isShortage = (availableStock - grossReq) < safetyStock || currentStock < safetyStock;
      
      const suggestedReorderQty = isShortage 
        ? Math.max(netRequirement, mat.reorderPoint || 0)
        : 0;

      const resultItem = {
        materialCode: mat.materialCode,
        name: mat.name,
        materialType: mat.materialType,
        uom: mat.uom,
        unitPrice: mat.unitPrice,
        currentStock,
        allocatedStock,
        availableStock,
        safetyStock,
        reorderPoint: mat.reorderPoint,
        leadTimeDays: mat.leadTimeDays,
        storageLocation: mat.storageLocation,
        grossRequirement: Math.round(grossReq * 100) / 100,
        netRequirement: Math.round(netRequirement * 100) / 100,
        suggestedOrderQty: Math.round(suggestedReorderQty * 100) / 100,
        isShortage,
        shortageQuantity: isShortage ? Math.round((safetyStock + grossReq - availableStock) * 100) / 100 : 0,
        estimatedCost: Math.round(suggestedReorderQty * mat.unitPrice),
        urgency: isShortage && availableStock <= 0 ? 'CRITICAL' : isShortage ? 'HIGH' : 'NORMAL'
      };

      mrpResults.push(resultItem);

      if (isShortage) {
        shortages.push(resultItem);
      }
    }

    return {
      calculationTimestamp: new Date().toISOString(),
      totalMaterialsAnalyzed: materials.length,
      totalDemandOrders: salesOrders.length + productionOrders.length,
      shortagesCount: shortages.length,
      shortages,
      allResults: mrpResults
    };
  }
};
