import { collections } from '../services/dbStore.js';
import { logAudit, triggerNotification } from '../services/workflowEngine.js';

export const getInspections = async (req, res) => {
  try {
    const inspections = await collections.qualityInspections.find({});
    return res.json({ success: true, count: inspections.length, data: inspections });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const createInspection = async (req, res) => {
  try {
    const { inspectionType, referenceDocument, materialOrProductCode, batchNumber, sampleSize, inspectionStage, parametersChecked, overallResult, defectCategory, reworkAction } = req.body;
    
    if (!materialOrProductCode || !referenceDocument) {
      return res.status(400).json({ success: false, message: 'Material/Product code and Reference Document are required.' });
    }

    const inspectionNumber = `QC-${Date.now().toString().slice(-6)}`;

    const newInspection = await collections.qualityInspections.create({
      inspectionNumber,
      inspectionType: inspectionType || 'In-Process (Production)',
      referenceDocument,
      materialOrProductCode,
      batchNumber: batchNumber || `BATCH-${Date.now().toString().slice(-4)}`,
      sampleSize: Number(sampleSize || 10),
      inspectionStage: inspectionStage || 'Final Quality Gate',
      parametersChecked: parametersChecked || [],
      overallResult: overallResult || 'Accepted',
      defectCategory: defectCategory || 'None',
      reworkAction: reworkAction || null,
      inspectorName: req.user?.fullName || 'Quality Engineer',
      inspectionDate: new Date().toISOString()
    });

    if (overallResult === 'Rejected') {
      await triggerNotification(
        'QUALITY_REJECTION',
        `Quality Rejection Logged: ${inspectionNumber}`,
        `Defect (${defectCategory}) detected on ${materialOrProductCode} (Doc: ${referenceDocument}). Immediate investigation required.`,
        'danger',
        '/quality/inspections'
      );
    }

    await logAudit(req.user, 'QUALITY_INSPECTION', 'Quality Management (QM)', inspectionNumber, `Recorded inspection: ${overallResult} (Defect: ${defectCategory})`, req);

    return res.status(201).json({ success: true, data: newInspection });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
