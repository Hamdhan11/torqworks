import { collections } from '../services/dbStore.js';
import { logAudit, triggerNotification } from '../services/workflowEngine.js';

// Machines
export const getMachines = async (req, res) => {
  try {
    const machines = await collections.machines.find({});
    return res.json({ success: true, count: machines.length, data: machines });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updateMachineStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, healthScore } = req.body;

    const machine = await collections.machines.findById(id);
    if (!machine) return res.status(404).json({ success: false, message: 'Machine not found' });

    const updated = await collections.machines.findByIdAndUpdate(id, {
      status: status || machine.status,
      healthScore: healthScore !== undefined ? healthScore : machine.healthScore
    });

    if (status === 'Breakdown') {
      await triggerNotification(
        'DOWNTIME_ALERT',
        `Machine Breakdown Alert: ${machine.machineCode}`,
        `Machine ${machine.name} has experienced unexpected breakdown. Maintenance team alerted.`,
        'danger',
        '/maintenance'
      );
    }

    await logAudit(req.user, 'MACHINE_STATUS_CHANGE', 'Plant Maintenance (PM)', machine.machineCode, `Updated status to ${status}`, req);

    return res.json({ success: true, data: updated });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Maintenance Orders
export const getMaintenanceOrders = async (req, res) => {
  try {
    const orders = await collections.maintenanceOrders.find({});
    return res.json({ success: true, count: orders.length, data: orders });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const createMaintenanceOrder = async (req, res) => {
  try {
    const { machineCode, maintenanceType, priority, reportedIssue, scheduledDate } = req.body;
    const machine = await collections.machines.findOne({ machineCode });
    if (!machine) return res.status(404).json({ success: false, message: `Machine ${machineCode} not found` });

    const orderNumber = `MO-2026-${Math.floor(400 + Math.random() * 600)}`;

    const newOrder = await collections.maintenanceOrders.create({
      orderNumber,
      machineCode,
      machineName: machine.name,
      maintenanceType: maintenanceType || 'Preventive',
      scheduledDate: scheduledDate || new Date().toISOString(),
      priority: priority || 'Medium',
      reportedIssue,
      status: 'Open',
      technicianName: req.user?.fullName || 'Senior Maintenance Engineer'
    });

    await logAudit(req.user, 'MAINTENANCE_ORDER_CREATE', 'Plant Maintenance (PM)', orderNumber, `Created ${maintenanceType} order for ${machineCode}`, req);

    return res.status(201).json({ success: true, data: newOrder });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Downtime Logs
export const getDowntimeLogs = async (req, res) => {
  try {
    const logs = await collections.downtimeLogs.find({});
    return res.json({ success: true, count: logs.length, data: logs });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const logDowntime = async (req, res) => {
  try {
    const { machineCode, durationMinutes, reasonCategory, rootCause } = req.body;
    const machine = await collections.machines.findOne({ machineCode });
    if (!machine) return res.status(404).json({ success: false, message: `Machine ${machineCode} not found` });

    const logNumber = `DTL-2026-${Math.floor(100 + Math.random() * 900)}`;

    const newLog = await collections.downtimeLogs.create({
      logNumber,
      machineCode,
      machineName: machine.name,
      startTime: new Date(Date.now() - (durationMinutes * 60000)).toISOString(),
      endTime: new Date().toISOString(),
      durationMinutes: Number(durationMinutes || 60),
      reasonCategory: reasonCategory || 'Mechanical Failure',
      rootCause: rootCause || 'Unscheduled operational stoppage',
      loggedBy: req.user?.fullName || 'Shift Technician'
    });

    // Update total downtime hours on machine
    const addedHours = Math.round((Number(durationMinutes) / 60) * 10) / 10;
    await collections.machines.updateOne(
      { machineCode },
      { totalDowntimeHours: (machine.totalDowntimeHours || 0) + addedHours }
    );

    await logAudit(req.user, 'DOWNTIME_LOGGED', 'Plant Maintenance (PM)', logNumber, `Logged ${durationMinutes} mins downtime on ${machineCode} (${reasonCategory})`, req);

    return res.status(201).json({ success: true, data: newLog });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
