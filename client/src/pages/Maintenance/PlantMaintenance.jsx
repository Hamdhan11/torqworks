import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { DataTable } from '../../components/Common/DataTable';
import { StatusBadge } from '../../components/Common/StatusBadge';
import { Modal } from '../../components/Common/Modal';
import { 
  Wrench, 
  AlertTriangle, 
  CheckCircle2, 
  Plus, 
  Cpu, 
  Clock, 
  Activity,
  Zap
} from 'lucide-react';

export const PlantMaintenance = () => {
  const [activeTab, setActiveTab] = useState('machines'); // 'machines', 'orders', 'downtime'
  const [machines, setMachines] = useState([]);
  const [orders, setOrders] = useState([]);
  const [downtimeLogs, setDowntimeLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [isDowntimeModalOpen, setIsDowntimeModalOpen] = useState(false);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);

  // Forms
  const [downtimeForm, setDowntimeForm] = useState({
    machineCode: 'MCH-PRESS-2500T',
    durationMinutes: 45,
    reasonCategory: 'Mechanical Failure',
    rootCause: 'Hydraulic proportional valve seal leak'
  });

  const [orderForm, setOrderForm] = useState({
    machineCode: 'MCH-FURNACE-T6-01',
    maintenanceType: 'Preventive',
    priority: 'High',
    reportedIssue: 'Zone 3 thermocouple calibration drift detected; heating elements check required'
  });

  useEffect(() => {
    loadMaintenanceData();
  }, []);

  const loadMaintenanceData = async () => {
    try {
      setLoading(true);
      const [machRes, ordRes, dtRes] = await Promise.all([
        api.getMachines(),
        api.getMaintenanceOrders(),
        api.getDowntimeLogs()
      ]);
      setMachines(machRes.data.data);
      setOrders(ordRes.data.data);
      setDowntimeLogs(dtRes.data.data);
    } catch (err) {
      console.error('Failed to load maintenance data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogDowntime = async (e) => {
    e.preventDefault();
    try {
      await api.logDowntime(downtimeForm);
      setIsDowntimeModalOpen(false);
      setActiveTab('downtime');
      loadMaintenanceData();
    } catch (err) {
      alert(`Error logging downtime: ${err.response?.data?.message || err.message}`);
    }
  };

  const handleCreateOrder = async (e) => {
    e.preventDefault();
    try {
      await api.createMaintenanceOrder(orderForm);
      setIsOrderModalOpen(false);
      setActiveTab('orders');
      loadMaintenanceData();
    } catch (err) {
      alert(`Error creating maintenance order: ${err.response?.data?.message || err.message}`);
    }
  };

  const machineColumns = [
    {
      header: 'Machine Code',
      accessor: 'machineCode',
      render: (row) => (
        <span className="font-mono font-bold text-blue-600 dark:text-blue-400">
          {row.machineCode}
        </span>
      )
    },
    {
      header: 'Machine Description',
      accessor: 'name',
      render: (row) => (
        <div>
          <p className="font-semibold text-slate-800 dark:text-slate-100">{row.name}</p>
          <span className="text-[10px] text-slate-400 font-mono">Work Centre: {row.workCentreCode}</span>
        </div>
      )
    },
    {
      header: 'Equipment Type',
      accessor: 'type'
    },
    {
      header: 'Operational Status',
      accessor: 'status',
      render: (row) => <StatusBadge status={row.status} />
    },
    {
      header: 'Health Score',
      accessor: 'healthScore',
      render: (row) => {
        const score = row.healthScore || 90;
        return (
          <div className="flex items-center gap-2">
            <div className="w-16 h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
              <div 
                className={`h-full rounded-full ${score > 85 ? 'bg-emerald-500' : score > 70 ? 'bg-amber-500' : 'bg-rose-500'}`} 
                style={{ width: `${score}%` }}
              />
            </div>
            <span className="font-mono font-bold text-xs">{score}%</span>
          </div>
        );
      }
    },
    {
      header: 'MTBF',
      accessor: 'mtbfHours',
      render: (row) => <span className="font-mono">{row.mtbfHours} hrs</span>
    },
    {
      header: 'MTTR',
      accessor: 'mttrHours',
      render: (row) => <span className="font-mono">{row.mttrHours} hrs</span>
    },
    {
      header: 'Total Downtime',
      accessor: 'totalDowntimeHours',
      render: (row) => <span className="font-mono font-bold text-rose-500">{row.totalDowntimeHours} hrs</span>
    }
  ];

  const orderColumns = [
    {
      header: 'Order #',
      accessor: 'orderNumber',
      render: (row) => (
        <span className="font-mono font-bold text-blue-600 dark:text-blue-400">
          {row.orderNumber}
        </span>
      )
    },
    {
      header: 'Machine',
      accessor: 'machineName',
      render: (row) => (
        <div>
          <p className="font-semibold text-slate-800 dark:text-slate-100">{row.machineName}</p>
          <span className="text-[10px] text-slate-400 font-mono">{row.machineCode}</span>
        </div>
      )
    },
    {
      header: 'Type',
      accessor: 'maintenanceType',
      render: (row) => (
        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
          {row.maintenanceType}
        </span>
      )
    },
    {
      header: 'Priority',
      accessor: 'priority',
      render: (row) => <StatusBadge status={row.priority} />
    },
    {
      header: 'Reported Issue',
      accessor: 'reportedIssue',
      render: (row) => <p className="text-xs text-slate-600 dark:text-slate-300 truncate max-w-xs">{row.reportedIssue}</p>
    },
    {
      header: 'Technician',
      accessor: 'technicianName'
    },
    {
      header: 'Status',
      accessor: 'status',
      render: (row) => <StatusBadge status={row.status} />
    }
  ];

  const downtimeColumns = [
    {
      header: 'Log #',
      accessor: 'logNumber',
      render: (row) => (
        <span className="font-mono font-bold text-blue-600 dark:text-blue-400">
          {row.logNumber}
        </span>
      )
    },
    {
      header: 'Machine',
      accessor: 'machineCode',
      render: (row) => (
        <div>
          <span className="font-mono font-bold">{row.machineCode}</span>
          <p className="text-[10px] text-slate-400">{row.machineName}</p>
        </div>
      )
    },
    {
      header: 'Downtime Duration',
      accessor: 'durationMinutes',
      render: (row) => (
        <span className="font-mono font-bold text-rose-600 dark:text-rose-400">
          {row.durationMinutes} mins
        </span>
      )
    },
    {
      header: 'Category',
      accessor: 'reasonCategory',
      render: (row) => (
        <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-100 dark:bg-slate-800">
          {row.reasonCategory}
        </span>
      )
    },
    {
      header: 'Root Cause',
      accessor: 'rootCause'
    },
    {
      header: 'Logged By',
      accessor: 'loggedBy'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header & Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Wrench className="w-5 h-5 text-blue-600" />
            <span>Plant Maintenance & OEE Asset Management (PM)</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Machine Master, MTBF/MTTR Telemetry, Breakdown Stoppage Tracking, and Preventive Maintenance
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex rounded-xl bg-slate-200 dark:bg-slate-800 p-1 text-xs">
            <button
              onClick={() => setActiveTab('machines')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                activeTab === 'machines' ? 'bg-white dark:bg-slate-900 text-blue-600 shadow-sm' : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              Machine Master
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                activeTab === 'orders' ? 'bg-white dark:bg-slate-900 text-blue-600 shadow-sm' : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              Maintenance Orders
            </button>
            <button
              onClick={() => setActiveTab('downtime')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                activeTab === 'downtime' ? 'bg-white dark:bg-slate-900 text-blue-600 shadow-sm' : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              Downtime Logs
            </button>
          </div>

          <button
            onClick={() => setIsDowntimeModalOpen(true)}
            className="px-3.5 py-2 text-xs font-semibold rounded-xl border border-rose-300 dark:border-rose-900 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors flex items-center gap-1.5"
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Log Machine Downtime</span>
          </button>

          <button
            onClick={() => setIsOrderModalOpen(true)}
            className="px-3.5 py-2 text-xs font-semibold rounded-xl bg-blue-600 hover:bg-blue-500 text-white shadow transition-all flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>New Maintenance Order</span>
          </button>
        </div>
      </div>

      {activeTab === 'machines' && (
        <DataTable
          title="Heavy Automotive Manufacturing Machine Registry"
          columns={machineColumns}
          data={machines}
          searchPlaceholder="Search machine code, name, or work centre..."
        />
      )}

      {activeTab === 'orders' && (
        <DataTable
          title="Preventive & Breakdown Maintenance Work Orders"
          columns={orderColumns}
          data={orders}
          searchPlaceholder="Search order #, machine, or technician..."
        />
      )}

      {activeTab === 'downtime' && (
        <DataTable
          title="Factory Machine Downtime Stoppage Audit"
          columns={downtimeColumns}
          data={downtimeLogs}
          searchPlaceholder="Search log #, machine, or failure category..."
        />
      )}

      {/* Log Downtime Modal */}
      <Modal
        isOpen={isDowntimeModalOpen}
        onClose={() => setIsDowntimeModalOpen(false)}
        title="Record Unscheduled Machine Stoppage / Downtime"
      >
        <form onSubmit={handleLogDowntime} className="space-y-4 text-xs">
          <div>
            <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Select Affected Machine</label>
            <select
              value={downtimeForm.machineCode}
              onChange={(e) => setDowntimeForm({ ...downtimeForm, machineCode: e.target.value })}
              className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs"
            >
              {machines.map(m => (
                <option key={m.machineCode} value={m.machineCode}>
                  {m.machineCode} - {m.name} ({m.type})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Downtime Duration (Minutes)</label>
              <input
                type="number"
                value={downtimeForm.durationMinutes}
                onChange={(e) => setDowntimeForm({ ...downtimeForm, durationMinutes: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 font-mono text-xs"
                required
              />
            </div>
            <div>
              <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Failure Classification</label>
              <select
                value={downtimeForm.reasonCategory}
                onChange={(e) => setDowntimeForm({ ...downtimeForm, reasonCategory: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs"
              >
                <option value="Mechanical Failure">Mechanical Failure</option>
                <option value="Electrical Fault">Electrical Fault</option>
                <option value="Hydraulic System Leak">Hydraulic System Leak</option>
                <option value="Tool / Die Wear">Tool / Die Wear</option>
                <option value="Material Starvation">Material Starvation</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Root Cause Explanation</label>
            <textarea
              value={downtimeForm.rootCause}
              onChange={(e) => setDowntimeForm({ ...downtimeForm, rootCause: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs"
              placeholder="Describe symptoms, parts replaced, or technician resolution..."
              required
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsDowntimeModalOpen(false)}
              className="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-semibold flex items-center gap-1.5 shadow"
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Record Downtime Log</span>
            </button>
          </div>
        </form>
      </Modal>

      {/* New Maintenance Order Modal */}
      <Modal
        isOpen={isOrderModalOpen}
        onClose={() => setIsOrderModalOpen(false)}
        title="Schedule Machine Maintenance Order"
      >
        <form onSubmit={handleCreateOrder} className="space-y-4 text-xs">
          <div>
            <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Target Machine</label>
            <select
              value={orderForm.machineCode}
              onChange={(e) => setOrderForm({ ...orderForm, machineCode: e.target.value })}
              className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs"
            >
              {machines.map(m => (
                <option key={m.machineCode} value={m.machineCode}>
                  {m.machineCode} - {m.name}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Maintenance Type</label>
              <select
                value={orderForm.maintenanceType}
                onChange={(e) => setOrderForm({ ...orderForm, maintenanceType: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs"
              >
                <option value="Preventive">Preventive Maintenance (PM)</option>
                <option value="Breakdown">Breakdown Repair</option>
                <option value="Predictive">AI Predictive Calibration</option>
              </select>
            </div>
            <div>
              <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Priority</label>
              <select
                value={orderForm.priority}
                onChange={(e) => setOrderForm({ ...orderForm, priority: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Emergency">Emergency Stoppage</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Maintenance Scope & Instructions</label>
            <textarea
              value={orderForm.reportedIssue}
              onChange={(e) => setOrderForm({ ...orderForm, reportedIssue: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs"
              required
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsOrderModalOpen(false)}
              className="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Issue Maintenance Work Order</span>
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
