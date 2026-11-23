import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { DataTable } from '../../components/Common/DataTable';
import { StatCard } from '../../components/Common/StatCard';
import { StatusBadge } from '../../components/Common/StatusBadge';
import { 
  Calculator, 
  TrendingUp, 
  DollarSign, 
  Layers, 
  BarChart3, 
  Building2, 
  PieChart as PieIcon 
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  Cell 
} from 'recharts';

export const FinanceControlling = () => {
  const [analysis, setAnalysis] = useState(null);
  const [costCentres, setCostCentres] = useState([]);
  const [profitCentres, setProfitCentres] = useState([]);
  const [costRecords, setCostRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFinanceData();
  }, []);

  const loadFinanceData = async () => {
    try {
      setLoading(true);
      const [anRes, ccRes, pcRes, crRes] = await Promise.all([
        api.getFinanceAnalysis(),
        api.getCostCentres(),
        api.getProfitCentres(),
        api.getCostRecords()
      ]);
      setAnalysis(anRes.data.data);
      setCostCentres(ccRes.data.data);
      setProfitCentres(pcRes.data.data);
      setCostRecords(crRes.data.data);
    } catch (err) {
      console.error('Failed to load finance data:', err);
    } finally {
      setLoading(false);
    }
  };

  const costVarianceColumns = [
    {
      header: 'Record #',
      accessor: 'recordNumber',
      render: (row) => (
        <span className="font-mono font-bold text-blue-600 dark:text-blue-400">
          {row.recordNumber}
        </span>
      )
    },
    {
      header: 'Order Reference',
      accessor: 'productionOrderNumber',
      render: (row) => (
        <div>
          <span className="font-mono font-bold">{row.productionOrderNumber}</span>
          <p className="text-[10px] text-slate-400">{row.productCode}</p>
        </div>
      )
    },
    {
      header: 'Standard Unit Cost',
      accessor: 'totalStandardCost',
      render: (row) => (
        <span className="font-mono font-semibold">₹{row.totalStandardCost?.toLocaleString()}</span>
      )
    },
    {
      header: 'Actual Unit Cost',
      accessor: 'totalActualCost',
      render: (row) => (
        <span className="font-mono font-bold">₹{row.totalActualCost?.toLocaleString()}</span>
      )
    },
    {
      header: 'Net Variance',
      accessor: 'costVariance',
      render: (row) => {
        const isUnfavorable = row.costVariance > 0;
        return (
          <span className={`font-mono font-bold ${isUnfavorable ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
            {isUnfavorable ? `+₹${row.costVariance}` : `-₹${Math.abs(row.costVariance)}`}
          </span>
        );
      }
    },
    {
      header: 'Variance %',
      accessor: 'variancePercentage',
      render: (row) => (
        <span className={`font-mono font-bold text-xs ${row.variancePercentage > 0 ? 'text-rose-500' : 'text-emerald-500'}`}>
          {row.variancePercentage > 0 ? `+${row.variancePercentage}%` : `${row.variancePercentage}%`}
        </span>
      )
    },
    {
      header: 'Financial Status',
      accessor: 'status',
      render: (row) => (
        <StatusBadge 
          status={row.status} 
          variant={row.status === 'Optimal' ? 'success' : 'warning'} 
        />
      )
    }
  ];

  const costCentreChartData = costCentres.map(c => ({
    name: c.costCenterCode.replace('CC-', ''),
    budget: Math.round(c.monthlyBudget / 100000),
    actual: Math.round(c.actualExpenditure / 100000)
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Calculator className="w-5 h-5 text-blue-600" />
          <span>Finance & Controlling (FI/CO) & Cost Center Analysis</span>
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Manufacturing cost absorption, Standard vs Actual cost variance, and Business Unit profitability
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <StatCard
          title="Total Contract Revenue"
          value={`₹${((analysis?.summary?.totalRevenue || 0) / 10000000).toFixed(2)} Cr`}
          subtitle="OEM Confirmed Orders"
          icon={DollarSign}
          color="blue"
        />
        <StatCard
          title="Overall Gross Margin"
          value={`${analysis?.summary?.grossMarginOverall || 31.8}%`}
          subtitle="Above automotive benchmark"
          icon={TrendingUp}
          color="emerald"
        />
        <StatCard
          title="Net Cost Variance"
          value={analysis?.summary?.netVariance > 0 ? `+₹${Math.round(analysis.summary.netVariance)}` : `-₹${Math.abs(Math.round(analysis?.summary?.netVariance || 0))}`}
          subtitle={`${analysis?.summary?.netVariancePercentage || 0}% vs Standard Cost`}
          icon={BarChart3}
          color={analysis?.summary?.netVariance > 0 ? 'rose' : 'emerald'}
        />
        <StatCard
          title="Active Profit Centres"
          value={profitCentres.length}
          subtitle="Commercial & Passenger Units"
          icon={Building2}
          color="indigo"
        />
      </div>

      {/* Cost Centers & Profit Centers Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cost Centre Expenditure Chart */}
        <div className="sap-card p-5 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">
                Departmental Cost Centers: Budget vs Actual (in Lakhs ₹)
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Stamping Press, Robotic Welding, CED Paint Shop, and T6 Heat Treatment
              </p>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={costCentreChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                />
                <Bar dataKey="budget" name="Budget (Lakhs ₹)" fill="#94a3b8" radius={[4, 4, 0, 0]} />
                <Bar dataKey="actual" name="Actual (Lakhs ₹)" fill="#2563eb" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Profit Centres Breakdown */}
        <div className="sap-card p-5">
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 mb-3">
            Business Unit Profitability (Profit Centres)
          </h3>
          <div className="space-y-4">
            {profitCentres.map((pc, idx) => (
              <div key={idx} className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">{pc.name}</h4>
                  <span className="font-mono text-xs font-bold text-emerald-600 dark:text-emerald-400">
                    {pc.grossMarginPercentage}% Margin
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 font-mono mt-0.5">{pc.division}</p>

                <div className="mt-2.5 pt-2 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between text-[11px] font-mono">
                  <span className="text-slate-500">Revenue: ₹{(pc.actualRevenue / 10000000).toFixed(1)} Cr</span>
                  <span className="text-slate-500">Costs: ₹{(pc.directCosts / 10000000).toFixed(1)} Cr</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Variance Analysis Table */}
      <DataTable
        title="Manufacturing Cost Variance Ledger (Standard vs Actual)"
        columns={costVarianceColumns}
        data={costRecords}
        searchPlaceholder="Search order reference or product..."
      />
    </div>
  );
};
