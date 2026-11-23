import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { DataTable } from '../../components/Common/DataTable';
import { StatusBadge } from '../../components/Common/StatusBadge';
import { StatCard } from '../../components/Common/StatCard';
import { 
  Cpu, 
  AlertTriangle, 
  RefreshCw, 
  FilePlus, 
  CheckCircle, 
  Clock, 
  Boxes 
} from 'lucide-react';

export const MRPCalculator = ({ onNavigate }) => {
  const [mrpData, setMrpData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generatingPR, setGeneratingPR] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    executeMRP();
  }, []);

  const executeMRP = async () => {
    try {
      setLoading(true);
      const res = await api.runMRP();
      setMrpData(res.data.data);
    } catch (err) {
      console.error('MRP Calculation error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleGeneratePR = async () => {
    if (!mrpData?.shortages || mrpData.shortages.length === 0) {
      alert('No material shortages detected in the system.');
      return;
    }

    setGeneratingPR(true);
    setSuccessMessage('');
    try {
      const res = await api.createPRFromMRP(mrpData.shortages);
      setSuccessMessage(res.data.message);
      executeMRP();
    } catch (err) {
      alert(`Failed to generate PR: ${err.response?.data?.message || err.message}`);
    } finally {
      setGeneratingPR(false);
    }
  };

  const columns = [
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
      header: 'Material Description',
      accessor: 'name',
      render: (row) => (
        <div>
          <p className="font-semibold text-slate-800 dark:text-slate-100">{row.name}</p>
          <span className="text-[10px] text-slate-400 font-mono">Location: {row.storageLocation}</span>
        </div>
      )
    },
    {
      header: 'Available Stock',
      accessor: 'availableStock',
      render: (row) => (
        <span className={`font-mono font-bold ${row.availableStock < row.safetyStock ? 'text-rose-600 dark:text-rose-400' : 'text-slate-800 dark:text-slate-200'}`}>
          {row.availableStock} {row.uom}
        </span>
      )
    },
    {
      header: 'Safety Stock',
      accessor: 'safetyStock',
      render: (row) => (
        <span className="font-mono text-slate-500">{row.safetyStock} {row.uom}</span>
      )
    },
    {
      header: 'Gross Demand',
      accessor: 'grossRequirement',
      render: (row) => (
        <span className="font-mono font-semibold">{row.grossRequirement} {row.uom}</span>
      )
    },
    {
      header: 'Net Requirement',
      accessor: 'netRequirement',
      render: (row) => (
        <span className="font-mono font-bold text-blue-600 dark:text-blue-400">
          {row.netRequirement} {row.uom}
        </span>
      )
    },
    {
      header: 'Lead Time',
      accessor: 'leadTimeDays',
      render: (row) => (
        <span className="text-xs text-slate-500 font-mono">{row.leadTimeDays} days</span>
      )
    },
    {
      header: 'MRP Urgency',
      accessor: 'urgency',
      render: (row) => (
        <StatusBadge 
          status={row.urgency} 
          variant={row.urgency === 'CRITICAL' ? 'danger' : row.urgency === 'HIGH' ? 'warning' : 'success'} 
        />
      )
    },
    {
      header: 'Suggested Reorder',
      accessor: 'suggestedOrderQty',
      render: (row) => (
        <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
          {row.suggestedOrderQty > 0 ? `${row.suggestedOrderQty} ${row.uom}` : 'Optimal'}
        </span>
      )
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Cpu className="w-5 h-5 text-blue-600" />
            <span>Material Requirement Planning (MRP) Engine</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Automated net requirements calculation, safety stock shortfall detection, and automated PR generation
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={executeMRP}
            disabled={loading}
            className="px-3 py-2 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors flex items-center gap-1.5"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Recalculate MRP</span>
          </button>

          <button
            onClick={handleGeneratePR}
            disabled={generatingPR || !mrpData?.shortagesCount}
            className="px-4 py-2 text-xs font-semibold rounded-xl bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-600/30 transition-all flex items-center gap-1.5 disabled:opacity-50"
          >
            <FilePlus className="w-4 h-4" />
            <span>{generatingPR ? 'Creating PR...' : 'Generate PR for Shortages'}</span>
          </button>
        </div>
      </div>

      {successMessage && (
        <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>{successMessage}</span>
          </div>
          {onNavigate && (
            <button
              onClick={() => onNavigate('procurement')}
              className="underline font-semibold hover:text-emerald-900"
            >
              Open Purchase Requisitions →
            </button>
          )}
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <StatCard
          title="Materials Analyzed"
          value={mrpData?.totalMaterialsAnalyzed || 14}
          subtitle="Full Plant Inventory"
          icon={Boxes}
          color="blue"
        />
        <StatCard
          title="Demand Orders"
          value={mrpData?.totalDemandOrders || 5}
          subtitle="Sales & Prod Queue"
          icon={Clock}
          color="indigo"
        />
        <StatCard
          title="Detected Shortages"
          value={`${mrpData?.shortagesCount || 0} Materials`}
          subtitle="Below Safety Threshold"
          icon={AlertTriangle}
          color="rose"
        />
        <StatCard
          title="Est. Procurement Value"
          value={`₹${(mrpData?.shortages?.reduce((sum, s) => sum + s.estimatedCost, 0) || 0).toLocaleString()}`}
          subtitle="For Auto-PR Reorder"
          icon={Cpu}
          color="amber"
        />
      </div>

      {/* MRP Table */}
      <DataTable
        title="Complete MRP Net Requirement Ledger"
        columns={columns}
        data={mrpData?.allResults || []}
        searchPlaceholder="Search material code or description..."
        filterKey="urgency"
        filterOptions={[
          { label: 'Critical Shortage', value: 'CRITICAL' },
          { label: 'High Urgency', value: 'HIGH' },
          { label: 'Normal / Healthy', value: 'NORMAL' }
        ]}
      />
    </div>
  );
};
