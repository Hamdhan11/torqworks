import { MRPEngine } from '../services/mrpEngine.js';
import { WorkflowEngine, logAudit } from '../services/workflowEngine.js';

export const runMRP = async (req, res) => {
  try {
    const mrpData = await MRPEngine.calculateMRP();
    await logAudit(req.user, 'MRP_CALCULATION_RUN', 'Material Requirement Planning (MRP)', 'MRP-RUN', `Calculated MRP. Found ${mrpData.shortagesCount} material shortages.`, req);
    return res.json({ success: true, data: mrpData });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const createPRFromMRP = async (req, res) => {
  try {
    const { shortageItems } = req.body;
    if (!shortageItems || shortageItems.length === 0) {
      return res.status(400).json({ success: false, message: 'No shortage items specified to generate PR.' });
    }

    const pr = await WorkflowEngine.createPRFromShortage(
      shortageItems,
      req.user?.fullName || 'MRP Planning Engine',
      req.user?.department || 'Production Planning & Control'
    );

    await logAudit(req.user, 'PR_AUTO_GENERATE', 'Material Requirement Planning (MRP)', pr.prNumber, `Generated PR with ${shortageItems.length} shortage items. Total: ₹${pr.totalAmount.toLocaleString()}`, req);

    return res.status(201).json({
      success: true,
      message: `Successfully generated Purchase Requisition ${pr.prNumber} from MRP shortage items.`,
      data: pr
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
