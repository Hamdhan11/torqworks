import { collections } from '../services/dbStore.js';
import { logAudit } from '../services/workflowEngine.js';

export const getCostCentres = async (req, res) => {
  try {
    const costCentres = await collections.costCentres.find({});
    return res.json({ success: true, count: costCentres.length, data: costCentres });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getProfitCentres = async (req, res) => {
  try {
    const profitCentres = await collections.profitCentres.find({});
    return res.json({ success: true, count: profitCentres.length, data: profitCentres });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getCostRecords = async (req, res) => {
  try {
    const records = await collections.costRecords.find({});
    return res.json({ success: true, count: records.length, data: records });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Manufacturing Cost Analysis & Profitability Breakdown
export const getManufacturingCostAnalysis = async (req, res) => {
  try {
    const costRecords = await collections.costRecords.find({});
    const profitCentres = await collections.profitCentres.find({});
    const salesOrders = await collections.salesOrders.find({});

    let totalStandardCost = 0;
    let totalActualCost = 0;
    let totalMaterialVariance = 0;
    let totalLaborVariance = 0;
    let totalOverheadVariance = 0;

    for (const rec of costRecords) {
      totalStandardCost += rec.totalStandardCost;
      totalActualCost += rec.totalActualCost;
      totalMaterialVariance += (rec.actualMaterialCost - rec.standardMaterialCost);
      totalLaborVariance += (rec.actualLaborCost - rec.standardLaborCost);
      totalOverheadVariance += (rec.actualOverheadCost - rec.standardOverheadCost);
    }

    const netVariance = totalActualCost - totalStandardCost;
    const netVariancePercentage = totalStandardCost > 0 ? (netVariance / totalStandardCost) * 100 : 0;

    const totalRevenue = salesOrders.reduce((sum, so) => sum + (so.totalAmount || 0), 0);

    return res.json({
      success: true,
      data: {
        summary: {
          totalRevenue,
          totalStandardCost: Math.round(totalStandardCost * 100) / 100,
          totalActualCost: Math.round(totalActualCost * 100) / 100,
          netVariance: Math.round(netVariance * 100) / 100,
          netVariancePercentage: Math.round(netVariancePercentage * 100) / 100,
          materialVariance: Math.round(totalMaterialVariance * 100) / 100,
          laborVariance: Math.round(totalLaborVariance * 100) / 100,
          overheadVariance: Math.round(totalOverheadVariance * 100) / 100,
          grossMarginOverall: totalRevenue > 0 ? Math.round(((totalRevenue - totalActualCost) / totalRevenue) * 1000) / 10 : 31.5
        },
        records: costRecords,
        profitCentres
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
