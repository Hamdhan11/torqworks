import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { DataTable } from '../../components/Common/DataTable';
import { StatusBadge } from '../../components/Common/StatusBadge';
import { Modal } from '../../components/Common/Modal';
import { 
  Boxes, 
  ArrowRightLeft, 
  AlertTriangle, 
  Plus, 
  History, 
  Layers, 
  CheckCircle2 
} from 'lucide-react';

export const MaterialMaster = () => {
  const [activeTab, setActiveTab] = useState('ALL'); // 'ALL', 'RM', 'HALB', 'FERT', 'MOVEMENTS'
  const [materials, setMaterials] = useState([]);
  const [movements, setMovements] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Forms
  const [transferForm, setTransferForm] = useState({
    materialCode: 'RM-STL-440',
    quantity: 500,
    fromLocation: 'RMS1-A01',
    toLocation: 'SAB2-LINE1',
    reason: 'Shop floor replenishment for rim stamping order'
  });

  const [newMaterialForm, setNewMaterialForm] = useState({
    materialCode: '',
    name: '',
    materialType: 'RM',
    uom: 'KG',
    unitPrice: 100,
    safetyStock: 500,
    reorderPoint: 1000,
    leadTimeDays: 7,
    storageLocation: 'RMS1-A01'
  });

  useEffect(() => {
    loadMaterialsData();
  }, []);

  const loadMaterialsData = async () => {
    try {
      setLoading(true);
      const [matRes, mvtRes] = await Promise.all([
        api.getMaterials(),
        api.getStockMovements()
      ]);
      setMaterials(matRes.data.data);
      setMovements(mvtRes.data.data);
    } catch (err) {
      console.error('Failed to load materials:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleTransfer = async (e) => {
    e.preventDefault();
    try {
      await api.transferStock(transferForm);
      setIsTransferModalOpen(false);
      loadMaterialsData();
    } catch (err) {
      alert(`Transfer error: ${err.response?.data?.message || err.message}`);
    }
  };

  const handleCreateMaterial = async (e) => {
    e.preventDefault();
    try {
      await api.createMaterial(newMaterialForm);
      setIsCreateModalOpen(false);
      loadMaterialsData();
    } catch (err) {
      alert(`Create material error: ${err.response?.data?.message || err.message}`);
    }
  };

  const filteredMaterials = activeTab === 'ALL' || activeTab === 'MOVEMENTS' 
    ? materials 
    : materials.filter(m => m.materialType === activeTab);

  const materialColumns = [
    {
      header: 'Material Code',
      accessor: 'materialCode',
      render: (row) => (
        <span className="font-mono font-bold text-blue-600 dark:text-blue-400">
          {row.materialCode}
        </span>
      )
    },
    {
      header: 'Description',
      accessor: 'name',
      render: (row) => (
        <div>
          <p className="font-semibold text-slate-800 dark:text-slate-100">{row.name}</p>
          <span className="text-[10px] text-slate-400 font-mono">Location: {row.storageLocation}</span>
        </div>
      )
    },
    {
      header: 'Type',
      accessor: 'materialType',
      render: (row) => {
        const typeLabels = { RM: 'Raw Material (RM)', HALB: 'Semi-Finished (HALB)', FERT: 'Finished Goods (FERT)' };
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
            {typeLabels[row.materialType] || row.materialType}
          </span>
        );
      }
    },
    {
      header: 'Current Stock',
      accessor: 'currentStock',
      render: (row) => (
        <span className={`font-mono font-bold ${row.currentStock < row.safetyStock ? 'text-rose-600 dark:text-rose-400' : 'text-slate-900 dark:text-white'}`}>
          {row.currentStock.toLocaleString()} {row.uom}
        </span>
      )
    },
    {
      header: 'Available Stock',
      accessor: 'availableStock',
      render: (row) => (
        <span className="font-mono font-semibold text-emerald-600 dark:text-emerald-400">
          {row.availableStock.toLocaleString()} {row.uom}
        </span>
      )
    },
    {
      header: 'Safety Stock',
      accessor: 'safetyStock',
      render: (row) => (
        <span className="font-mono text-slate-500">{row.safetyStock.toLocaleString()} {row.uom}</span>
      )
    },
    {
      header: 'Standard Cost',
      accessor: 'standardCost',
      render: (row) => (
        <span className="font-mono font-semibold">₹{row.standardCost}</span>
      )
    },
    {
      header: 'Stock Valuation',
      accessor: 'totalVal',
      render: (row) => (
        <span className="font-mono font-bold text-slate-900 dark:text-white">
          ₹{Math.round(row.currentStock * row.standardCost).toLocaleString()}
        </span>
      )
    },
    {
      header: 'Health',
      accessor: 'currentStock',
      render: (row) => {
        const isLow = row.currentStock < row.safetyStock;
        return (
          <StatusBadge 
            status={isLow ? 'LOW STOCK' : 'HEALTHY'} 
            variant={isLow ? 'danger' : 'success'} 
          />
        );
      }
    }
  ];

  const movementColumns = [
    {
      header: 'Movement #',
      accessor: 'movementNumber',
      render: (row) => (
        <span className="font-mono font-bold text-blue-600 dark:text-blue-400">
          {row.movementNumber}
        </span>
      )
    },
    {
      header: 'Movement Type (SAP)',
      accessor: 'movementType',
      render: (row) => (
        <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300">
          {row.movementType}
        </span>
      )
    },
    {
      header: 'Material',
      accessor: 'materialCode',
      render: (row) => (
        <div>
          <span className="font-mono font-semibold">{row.materialCode}</span>
          <p className="text-[10px] text-slate-400">{row.materialName}</p>
        </div>
      )
    },
    {
      header: 'Quantity Moved',
      accessor: 'quantity',
      render: (row) => (
        <span className="font-mono font-bold">{row.quantity} {row.uom}</span>
      )
    },
    {
      header: 'From → To Location',
      accessor: 'fromLocation',
      render: (row) => (
        <span className="text-xs font-mono text-slate-600 dark:text-slate-400">
          {row.fromLocation} → {row.toLocation}
        </span>
      )
    },
    {
      header: 'Timestamp',
      accessor: 'movementDate',
      render: (row) => (
        <span className="text-xs font-mono text-slate-400">
          {new Date(row.movementDate).toLocaleString()}
        </span>
      )
    },
    {
      header: 'Logged By',
      accessor: 'performedBy'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Boxes className="w-5 h-5 text-blue-600" />
            <span>Materials Management & Stock Valuation (MM)</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Raw Materials (RM), Semi-Finished (HALB), and Finished (FERT) inventory control with SAP 311 Plant Transfers
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Material Type Filter Tabs */}
          <div className="flex rounded-xl bg-slate-200 dark:bg-slate-800 p-1 text-xs">
            {['ALL', 'RM', 'HALB', 'FERT', 'MOVEMENTS'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                  activeTab === tab ? 'bg-white dark:bg-slate-900 text-blue-600 shadow-sm' : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                {tab === 'MOVEMENTS' ? 'Stock Movements' : tab}
              </button>
            ))}
          </div>

          <button
            onClick={() => setIsTransferModalOpen(true)}
            className="px-3.5 py-2 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors flex items-center gap-1.5"
          >
            <ArrowRightLeft className="w-3.5 h-3.5" />
            <span>Stock Transfer (311)</span>
          </button>

          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="px-3.5 py-2 text-xs font-semibold rounded-xl bg-blue-600 hover:bg-blue-500 text-white shadow transition-all flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Add Material</span>
          </button>
        </div>
      </div>

      {activeTab === 'MOVEMENTS' ? (
        <DataTable
          title="SAP Stock Movements Ledger (101, 261, 311, 551)"
          columns={movementColumns}
          data={movements}
          searchPlaceholder="Search movement #, material or location..."
        />
      ) : (
        <DataTable
          title={`Materials Master Catalog (${activeTab})`}
          columns={materialColumns}
          data={filteredMaterials}
          searchPlaceholder="Search material code, name, or storage location..."
        />
      )}

      {/* Stock Transfer Modal (SAP 311 Movement) */}
      <Modal
        isOpen={isTransferModalOpen}
        onClose={() => setIsTransferModalOpen(false)}
        title="Execute Plant Stock Transfer (SAP 311 Movement)"
      >
        <form onSubmit={handleTransfer} className="space-y-4 text-xs">
          <div>
            <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Select Material</label>
            <select
              value={transferForm.materialCode}
              onChange={(e) => setTransferForm({ ...transferForm, materialCode: e.target.value })}
              className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs"
            >
              {materials.map(m => (
                <option key={m.materialCode} value={m.materialCode}>
                  {m.materialCode} - {m.name} (Avail: {m.availableStock} {m.uom})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Quantity to Transfer</label>
              <input
                type="number"
                value={transferForm.quantity}
                onChange={(e) => setTransferForm({ ...transferForm, quantity: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 font-mono text-xs"
                required
              />
            </div>
            <div>
              <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Target Storage Location</label>
              <select
                value={transferForm.toLocation}
                onChange={(e) => setTransferForm({ ...transferForm, toLocation: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs"
              >
                <option value="SAB2-LINE1">SAB2-LINE1 (Rim Cold Coiling Line Buffer)</option>
                <option value="SAB2-LINE2">SAB2-LINE2 (Press Shop Buffer)</option>
                <option value="SAB2-LINE3">SAB2-LINE3 (Robotic Welding Buffer)</option>
                <option value="FGW1-BAY-A">FGW1-BAY-A (Finished Goods Warehouse Bay A)</option>
                <option value="RMS1-A01">RMS1-A01 (Raw Material Central Stores)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Transfer Justification</label>
            <input
              type="text"
              value={transferForm.reason}
              onChange={(e) => setTransferForm({ ...transferForm, reason: e.target.value })}
              className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsTransferModalOpen(false)}
              className="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold flex items-center gap-1.5 shadow"
            >
              <ArrowRightLeft className="w-3.5 h-3.5" />
              <span>Confirm 311 Transfer</span>
            </button>
          </div>
        </form>
      </Modal>

      {/* Create Material Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Add Material to Plant Catalog"
      >
        <form onSubmit={handleCreateMaterial} className="space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Material Code</label>
              <input
                type="text"
                value={newMaterialForm.materialCode}
                onChange={(e) => setNewMaterialForm({ ...newMaterialForm, materialCode: e.target.value })}
                placeholder="e.g. RM-STL-590"
                className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 font-mono text-xs"
                required
              />
            </div>
            <div>
              <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Material Type</label>
              <select
                value={newMaterialForm.materialType}
                onChange={(e) => setNewMaterialForm({ ...newMaterialForm, materialType: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs"
              >
                <option value="RM">Raw Material (RM)</option>
                <option value="HALB">Semi-Finished (HALB)</option>
                <option value="FERT">Finished Goods (FERT)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Material Description</label>
            <input
              type="text"
              value={newMaterialForm.name}
              onChange={(e) => setNewMaterialForm({ ...newMaterialForm, name: e.target.value })}
              className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs"
              required
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Unit of Measure</label>
              <input
                type="text"
                value={newMaterialForm.uom}
                onChange={(e) => setNewMaterialForm({ ...newMaterialForm, uom: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 font-mono text-xs"
                required
              />
            </div>
            <div>
              <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Unit Standard Cost (₹)</label>
              <input
                type="number"
                value={newMaterialForm.unitPrice}
                onChange={(e) => setNewMaterialForm({ ...newMaterialForm, unitPrice: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 font-mono text-xs"
                required
              />
            </div>
            <div>
              <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Safety Stock</label>
              <input
                type="number"
                value={newMaterialForm.safetyStock}
                onChange={(e) => setNewMaterialForm({ ...newMaterialForm, safetyStock: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 font-mono text-xs"
                required
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsCreateModalOpen(false)}
              className="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold"
            >
              Save Material
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
