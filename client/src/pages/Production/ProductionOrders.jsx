import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { DataTable } from '../../components/Common/DataTable';
import { StatusBadge } from '../../components/Common/StatusBadge';
import { Modal } from '../../components/Common/Modal';
import { useAuth } from '../../context/AuthContext';
import { 
  Factory, 
  Plus, 
  Play, 
  CheckCircle2, 
  ArrowRight, 
  Clock, 
  AlertCircle,
  FileText
} from 'lucide-react';

const MANUFACTURING_STAGES = [
  'Rim',
  'Disc',
  'Assembly',
  'Heat Treatment',
  'Painting',
  'Quality Inspection',
  'Packing'
];

export const ProductionOrders = () => {
  const { user, hasAccess } = useAuth();
  const [orders, setOrders] = useState([]);
  const [routings, setRoutings] = useState([]);
  const [workCentres, setWorkCentres] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isAdvanceModalOpen, setIsAdvanceModalOpen] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Forms
  const [newOrderForm, setNewOrderForm] = useState({
    salesOrderNumber: '',
    productCode: 'WHL-STL-22C',
    quantityToProduce: 250,
    dueDate: '',
    shift: 'Shift A (Morning)'
  });

  const [advanceForm, setAdvanceForm] = useState({
    acceptedQty: 0,
    rejectedQty: 0,
    notes: ''
  });

  useEffect(() => {
    fetchProductionData();
  }, []);

  const fetchProductionData = async () => {
    try {
      setLoading(true);
      const [ordRes, routRes, wcRes] = await Promise.all([
        api.getProductionOrders(),
        api.getRoutings(),
        api.getWorkCentres()
      ]);
      setOrders(ordRes.data.data);
      setRoutings(routRes.data.data);
      setWorkCentres(wcRes.data.data);
    } catch (err) {
      console.error('Failed to load production orders:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateOrder = async (e) => {
    e.preventDefault();
    try {
      await api.createProductionOrder(newOrderForm);
      setIsCreateModalOpen(false);
      fetchProductionData();
    } catch (err) {
      alert(`Error creating production order: ${err.response?.data?.message || err.message}`);
    }
  };

  const handleReleaseOrder = async (orderId) => {
    try {
      await api.releaseProductionOrder(orderId);
      fetchProductionData();
    } catch (err) {
      alert(`Error releasing order: ${err.response?.data?.message || err.message}`);
    }
  };

  const openAdvanceModal = (order) => {
    setSelectedOrder(order);
    setAdvanceForm({
      acceptedQty: order.quantityToProduce - (order.scrappedQuantity || 0),
      rejectedQty: 0,
      notes: `Standard stage transition completed by ${user?.fullName}`
    });
    setIsAdvanceModalOpen(true);
  };

  const handleAdvanceStage = async (e) => {
    e.preventDefault();
    if (!selectedOrder) return;
    try {
      await api.advanceProductionStage(selectedOrder._id, advanceForm);
      setIsAdvanceModalOpen(false);
      fetchProductionData();
    } catch (err) {
      alert(`Error advancing stage: ${err.response?.data?.message || err.message}`);
    }
  };

  const openHistoryModal = (order) => {
    setSelectedOrder(order);
    setIsHistoryModalOpen(true);
  };

  const columns = [
    {
      header: 'Order #',
      accessor: 'productionOrderNumber',
      render: (row) => (
        <span className="font-mono font-bold text-blue-600 dark:text-blue-400">
          {row.productionOrderNumber}
        </span>
      )
    },
    {
      header: 'Product Specification',
      accessor: 'productName',
      render: (row) => (
        <div>
          <p className="font-semibold text-slate-800 dark:text-slate-100">{row.productName}</p>
          <span className="text-[10px] text-slate-400 font-mono">{row.productCode}</span>
        </div>
      )
    },
    {
      header: 'Order Qty',
      accessor: 'quantityToProduce',
      render: (row) => (
        <span className="font-mono font-bold">{row.quantityToProduce} pcs</span>
      )
    },
    {
      header: 'Current Stage',
      accessor: 'currentStage',
      render: (row) => {
        const isCompleted = row.currentStage === 'Completed';
        const idx = MANUFACTURING_STAGES.indexOf(row.currentStage);
        return (
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            <span className="font-bold text-xs text-slate-800 dark:text-slate-200">
              {row.currentStage}
            </span>
            {!isCompleted && idx !== -1 && (
              <span className="text-[10px] text-slate-400 font-mono">({idx + 1}/7)</span>
            )}
          </div>
        );
      }
    },
    {
      header: 'Work Centre',
      accessor: 'assignedWorkCentre',
      render: (row) => (
        <span className="text-xs font-mono text-slate-600 dark:text-slate-400">
          {row.assignedWorkCentre || 'WC-RIM-FORMING'}
        </span>
      )
    },
    {
      header: 'Status',
      accessor: 'status',
      render: (row) => <StatusBadge status={row.status} />
    },
    {
      header: 'Due Date',
      accessor: 'dueDate',
      render: (row) => (
        <span className="text-xs font-mono text-slate-500">
          {row.dueDate ? new Date(row.dueDate).toLocaleDateString() : 'N/A'}
        </span>
      )
    },
    {
      header: 'Workflow Actions',
      accessor: '_id',
      render: (row) => (
        <div className="flex items-center gap-2">
          {row.status === 'Created' && (
            <button
              onClick={() => handleReleaseOrder(row._id)}
              className="px-2.5 py-1 text-xs rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium flex items-center gap-1 shadow-sm transition-colors"
            >
              <Play className="w-3 h-3" />
              <span>Release</span>
            </button>
          )}

          {(row.status === 'Released' || row.status === 'In Progress') && row.currentStage !== 'Completed' && (
            <button
              onClick={() => openAdvanceModal(row)}
              className="px-2.5 py-1 text-xs rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium flex items-center gap-1 shadow-sm transition-colors"
            >
              <span>Advance Stage</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          )}

          <button
            onClick={() => openHistoryModal(row)}
            title="View Stage Audit History"
            className="p-1 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <FileText className="w-3.5 h-3.5" />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      {/* Top action bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Factory className="w-5 h-5 text-blue-600" />
            <span>Production Planning & Stage-wise Execution (PP)</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Automotive Wheel Manufacturing: Rim → Disc → Assembly → Heat Treatment → Painting → Quality Inspection → Packing
          </p>
        </div>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="px-4 py-2 text-xs font-semibold rounded-xl bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/30 transition-all flex items-center gap-1.5 self-start"
        >
          <Plus className="w-4 h-4" />
          <span>New Production Order</span>
        </button>
      </div>

      {/* Main Table */}
      <DataTable
        title="Active Shop Floor Production Orders"
        columns={columns}
        data={orders}
        searchPlaceholder="Search order #, product, or stage..."
        filterKey="currentStage"
        filterOptions={[
          { label: 'Rim Line', value: 'Rim' },
          { label: 'Disc Stamping', value: 'Disc' },
          { label: 'Robotic Assembly', value: 'Assembly' },
          { label: 'Heat Treatment', value: 'Heat Treatment' },
          { label: 'CED Painting', value: 'Painting' },
          { label: 'Quality QC', value: 'Quality Inspection' },
          { label: 'Packing', value: 'Packing' },
          { label: 'Completed', value: 'Completed' }
        ]}
      />

      {/* Advance Stage Modal */}
      <Modal
        isOpen={isAdvanceModalOpen}
        onClose={() => setIsAdvanceModalOpen(false)}
        title={`Advance Manufacturing Stage: ${selectedOrder?.productionOrderNumber}`}
      >
        <form onSubmit={handleAdvanceStage} className="space-y-4 text-xs">
          <div className="p-3 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 rounded-xl">
            <p className="font-semibold text-blue-900 dark:text-blue-200">
              Current Stage: <span className="font-bold underline">{selectedOrder?.currentStage}</span>
            </p>
            <p className="text-blue-700 dark:text-blue-400 text-[11px] mt-1">
              Next Stage:{' '}
              <strong className="text-blue-900 dark:text-white">
                {MANUFACTURING_STAGES[MANUFACTURING_STAGES.indexOf(selectedOrder?.currentStage) + 1] || 'Completed & Moved to FERT Warehouse'}
              </strong>
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                Accepted Units
              </label>
              <input
                type="number"
                value={advanceForm.acceptedQty}
                onChange={(e) => setAdvanceForm({ ...advanceForm, acceptedQty: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 font-mono text-xs"
                required
              />
            </div>
            <div>
              <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                Scrapped / Rejected Units
              </label>
              <input
                type="number"
                value={advanceForm.rejectedQty}
                onChange={(e) => setAdvanceForm({ ...advanceForm, rejectedQty: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 font-mono text-xs text-rose-500"
              />
            </div>
          </div>

          <div>
            <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
              Operator Sign-off & Inspection Notes
            </label>
            <textarea
              value={advanceForm.notes}
              onChange={(e) => setAdvanceForm({ ...advanceForm, notes: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs"
              placeholder="Record weld profile, dimension checks, furnace cycle temp, or operator remarks..."
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsAdvanceModalOpen(false)}
              className="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold flex items-center gap-1.5 shadow"
            >
              <span>Confirm & Advance to Next Stage</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>
      </Modal>

      {/* Stage History Modal */}
      <Modal
        isOpen={isHistoryModalOpen}
        onClose={() => setIsHistoryModalOpen(false)}
        title={`Stage Audit History: ${selectedOrder?.productionOrderNumber}`}
      >
        <div className="space-y-3 text-xs">
          {selectedOrder?.stageHistory && selectedOrder.stageHistory.length > 0 ? (
            selectedOrder.stageHistory.map((hist, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <div className="flex items-center justify-between font-semibold">
                  <span className="text-blue-600 dark:text-blue-400 font-mono">{hist.stage} Gate</span>
                  <span className="text-slate-400 text-[10px]">
                    {hist.completedAt ? new Date(hist.completedAt).toLocaleString() : 'In Progress'}
                  </span>
                </div>
                <div className="mt-1 flex items-center gap-4 text-[11px] text-slate-600 dark:text-slate-300">
                  <span>Accepted: <strong>{hist.acceptedQty}</strong></span>
                  <span>Scrapped: <strong className="text-rose-500">{hist.rejectedQty}</strong></span>
                  <span>Operator: {hist.operator}</span>
                </div>
                {hist.notes && (
                  <p className="mt-1 text-[11px] text-slate-500 italic">"{hist.notes}"</p>
                )}
              </div>
            ))
          ) : (
            <p className="text-slate-400 py-6 text-center">No stage transitions logged yet for this order.</p>
          )}
        </div>
      </Modal>

      {/* Create Order Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create Automotive Production Order"
      >
        <form onSubmit={handleCreateOrder} className="space-y-4 text-xs">
          <div>
            <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
              Finished Good Product (FERT)
            </label>
            <select
              value={newOrderForm.productCode}
              onChange={(e) => setNewOrderForm({ ...newOrderForm, productCode: e.target.value })}
              className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs"
            >
              <option value="WHL-STL-22C">WHL-STL-22C (22.5x9.00 Heavy Commercial Steel Wheel)</option>
              <option value="WHL-ALU-16D">WHL-ALU-16D (16x6.5J Diamond Cut Tubeless Alloy Wheel)</option>
              <option value="WHL-ALU-17S">WHL-ALU-17S (17x7.0J Silver Metallic Premium Alloy)</option>
              <option value="WHL-ALU-19P">WHL-ALU-19P (19x8.5J Forged High-Performance Alloy)</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                Quantity to Produce (PCS)
              </label>
              <input
                type="number"
                value={newOrderForm.quantityToProduce}
                onChange={(e) => setNewOrderForm({ ...newOrderForm, quantityToProduce: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 font-mono text-xs"
                required
              />
            </div>
            <div>
              <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                Shift Allocation
              </label>
              <select
                value={newOrderForm.shift}
                onChange={(e) => setNewOrderForm({ ...newOrderForm, shift: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs"
              >
                <option value="Shift A (Morning)">Shift A (Morning: 06:00 - 14:30)</option>
                <option value="Shift B (Evening)">Shift B (Evening: 14:30 - 23:00)</option>
                <option value="Shift C (Night)">Shift C (Night: 23:00 - 06:00)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
              Sales Order Reference (Optional)
            </label>
            <input
              type="text"
              value={newOrderForm.salesOrderNumber}
              onChange={(e) => setNewOrderForm({ ...newOrderForm, salesOrderNumber: e.target.value })}
              placeholder="e.g. SO-2026-001 or leave blank for stock build"
              className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsCreateModalOpen(false)}
              className="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold flex items-center gap-1.5 shadow"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Create Order</span>
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
