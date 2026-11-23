import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { StatCard } from '../components/Common/StatCard';
import { StatusBadge } from '../components/Common/StatusBadge';
import { 
  ShoppingCart, 
  Factory, 
  Boxes, 
  AlertTriangle, 
  Cpu, 
  ShieldCheck, 
  CheckCircle, 
  DollarSign, 
  TrendingUp, 
  Clock, 
  Activity,
  ArrowRight,
  Sparkles,
  Flame
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';

export const Dashboard = ({ onNavigate }) => {
  const [loading, setLoading] = useState(true);
  const [pipelineData, setPipelineData] = useState(null);
  const [aiSummary, setAiSummary] = useState(null);
  const [mrpData, setMrpData] = useState(null);
  const [financeData, setFinanceData] = useState(null);
  const [machines, setMachines] = useState([]);
  const [pendingPRs, setPendingPRs] = useState([]);
  const [recentLogs, setRecentLogs] = useState([]);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setLoading(true);
        const [pipeRes, aiRes, mrpRes, finRes, machRes, prsRes, logsRes] = await Promise.all([
          api.getWorkflowPipeline(),
          api.getAISummary(),
          api.runMRP(),
          api.getFinanceAnalysis(),
          api.getMachines(),
          api.getPRs(),
          api.getSystemLogs()
        ]);

        setPipelineData(pipeRes.data.data);
        setAiSummary(aiRes.data.data);
        setMrpData(mrpRes.data.data);
        setFinanceData(finRes.data.data);
        setMachines(machRes.data.data);
        setPendingPRs(prsRes.data.data.filter(p => p.status === 'Pending Approval'));
        setRecentLogs(logsRes.data.data.slice(0, 6));
      } catch (err) {
        console.error('Error loading dashboard:', err);
      } finally {
        setLoading(false);
      }
    };
    loadDashboard();
  }, []);

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[500px]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs text-slate-500 font-mono">Loading Enterprise Telemetry...</p>
        </div>
      </div>
    );
  }

  // Production Stage Bar Data
  const stageChartData = [
    { stage: 'Rim', units: pipelineData?.stageBreakdown?.Rim || 0 },
    { stage: 'Disc', units: pipelineData?.stageBreakdown?.Disc || 0 },
    { stage: 'Assembly', units: pipelineData?.stageBreakdown?.Assembly || 0 },
    { stage: 'Heat Treat', units: pipelineData?.stageBreakdown?.HeatTreatment || 0 },
    { stage: 'CED Paint', units: pipelineData?.stageBreakdown?.Painting || 0 },
    { stage: 'Quality QC', units: pipelineData?.stageBreakdown?.QualityInspection || 0 },
    { stage: 'Packing', units: pipelineData?.stageBreakdown?.Packing || 0 },
    { stage: 'Completed', units: pipelineData?.stageBreakdown?.Completed || 0 }
  ];

  // Daily Production Output Trend
  const trendData = [
    { day: 'Mon', wheels: 410, target: 450 },
    { day: 'Tue', wheels: 435, target: 450 },
    { day: 'Wed', wheels: 420, target: 450 },
    { day: 'Thu', wheels: 460, target: 450 },
    { day: 'Fri', wheels: 480, target: 450 },
    { day: 'Sat', wheels: 440, target: 450 },
    { day: 'Today', wheels: 475, target: 450 }
  ];

  const operationalMachines = machines.filter(m => m.status === 'Operational' || m.status === 'Running').length;
  const machineAvailPct = machines.length > 0 ? Math.round((operationalMachines / machines.length) * 100) : 95;

  return (
    <div className="space-y-6">
      {/* Plant Executive Status Banner */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 text-white border border-blue-900/40 shadow-lg relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-mono uppercase tracking-wider text-blue-300 font-semibold">
                Centralized Plant Operations • Plant 01 Wheels Facility
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold mt-1 text-white tracking-tight">
              Wheels Manufacturing Execution Center
            </h2>
            <p className="text-xs text-slate-300 mt-1">
              Connected SAP Modules: SD • MM • BOM • PP • MRP • QM • PM • FI/CO
            </p>
          </div>

          {/* Plant Health Meter */}
          <div className="flex items-center gap-4 bg-slate-900/80 border border-slate-700/80 px-4 py-2.5 rounded-xl backdrop-blur">
            <div>
              <p className="text-[10px] text-slate-400 uppercase font-mono">Plant Health Index</p>
              <div className="flex items-baseline gap-1.5 mt-0.5">
                <span className="text-2xl font-black font-mono text-emerald-400">
                  {aiSummary?.plantHealthIndex || 88}%
                </span>
                <span className="text-[11px] font-bold text-slate-300">{aiSummary?.healthStatus || 'STABLE'}</span>
              </div>
            </div>
            <button
              onClick={() => onNavigate('ai-insights')}
              className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-500 text-white transition-colors flex items-center gap-1"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI Hub</span>
            </button>
          </div>
        </div>
      </div>

      {/* Critical Operational Alerts Strip */}
      {mrpData?.shortagesCount > 0 && (
        <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-rose-500 text-white">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-rose-800 dark:text-rose-200">
                Material Shortage Warning: {mrpData.shortagesCount} critical raw materials below safety threshold!
              </p>
              <p className="text-[11px] text-rose-600 dark:text-rose-400 mt-0.5">
                Auto-MRP has calculated net requirements. Immediate Purchase Requisitions generated.
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigate('mrp')}
            className="px-3 py-1.5 text-xs font-bold rounded-lg bg-rose-600 hover:bg-rose-700 text-white transition-colors shrink-0"
          >
            Review MRP Shortages →
          </button>
        </div>
      )}

      {/* 12 Key Performance Indicator (KPI) Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
        <StatCard
          title="Customer Orders"
          value={pipelineData?.totalSalesOrders || 3}
          subtitle="Sales & Distribution"
          icon={ShoppingCart}
          color="blue"
          onClick={() => onNavigate('sales')}
        />
        <StatCard
          title="Today's Output"
          value="475 pcs"
          subtitle="Target: 450 pcs"
          icon={Factory}
          color="emerald"
          onClick={() => onNavigate('production')}
        />
        <StatCard
          title="Active Prod Orders"
          value={pipelineData?.totalProductionOrders || 2}
          subtitle="Shop Floor Queue"
          icon={Activity}
          color="indigo"
          onClick={() => onNavigate('production')}
        />
        <StatCard
          title="Critical Shortages"
          value={`${mrpData?.shortagesCount || 0} items`}
          subtitle="MRP Alert"
          icon={AlertTriangle}
          color="rose"
          onClick={() => onNavigate('mrp')}
        />
        <StatCard
          title="Machine Availability"
          value={`${machineAvailPct}%`}
          subtitle={`${operationalMachines}/${machines.length} Operational`}
          icon={Cpu}
          color="emerald"
          onClick={() => onNavigate('maintenance')}
        />
        <StatCard
          title="Downtime Rate"
          value="2.8%"
          subtitle="MTBF: 520h • MTTR: 2.1h"
          icon={Clock}
          color="amber"
          onClick={() => onNavigate('maintenance')}
        />
        <StatCard
          title="Production OEE"
          value="94.2%"
          subtitle="World Class standard"
          icon={TrendingUp}
          color="purple"
          onClick={() => onNavigate('production')}
        />
        <StatCard
          title="QC Rejection"
          value="0.68%"
          subtitle="PPM Defect: 680"
          icon={ShieldCheck}
          color="emerald"
          onClick={() => onNavigate('quality')}
        />
        <StatCard
          title="Pending PRs"
          value={pendingPRs.length}
          subtitle="Awaiting Approval"
          icon={ShoppingCart}
          color="amber"
          onClick={() => onNavigate('procurement')}
        />
        <StatCard
          title="Standard vs Actual"
          value={financeData?.summary?.netVariance > 0 ? `+₹${Math.round(financeData.summary.netVariance)}` : `-₹${Math.abs(Math.round(financeData?.summary?.netVariance || 0))}`}
          subtitle={`${financeData?.summary?.netVariancePercentage || 0}% Variance`}
          icon={DollarSign}
          color="rose"
          onClick={() => onNavigate('finance')}
        />
        <StatCard
          title="Delivery On-Time"
          value="98.4%"
          subtitle="Tata, M&M, Maruti"
          icon={CheckCircle}
          color="emerald"
          onClick={() => onNavigate('sales')}
        />
        <StatCard
          title="Inventory Valuation"
          value="₹8.42 Cr"
          subtitle="RM + HALB + FERT"
          icon={Boxes}
          color="blue"
          onClick={() => onNavigate('materials')}
        />
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Production Stage Distribution */}
        <div className="sap-card p-5 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 tracking-tight">
                7-Stage Wheel Manufacturing Work-in-Progress (WIP)
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Units actively processing across sequential automotive work centres
              </p>
            </div>
            <button
              onClick={() => onNavigate('production')}
              className="text-xs text-blue-600 dark:text-blue-400 font-semibold hover:underline flex items-center gap-1"
            >
              <span>Stage Tracker</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stageChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey="stage" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                />
                <Bar dataKey="units" fill="#2563eb" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Daily Production Trend */}
        <div className="sap-card p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 tracking-tight">
                Daily Finished Wheel Output
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Actual vs Daily Capacity Target (450 pcs)
              </p>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorWheels" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey="day" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="wheels" stroke="#10b981" fillOpacity={1} fill="url(#colorWheels)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Bottlenecks, Pending Approvals & Activity Logs Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* AI Bottlenecks & Capacity Warning */}
        <div className="sap-card p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <Flame className="w-4 h-4 text-amber-500" />
              <span>Live Bottleneck Detection</span>
            </h3>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 font-semibold">
              AI Monitored
            </span>
          </div>

          <div className="space-y-3">
            {aiSummary?.bottlenecks && aiSummary.bottlenecks.length > 0 ? (
              aiSummary.bottlenecks.map((b, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-xs text-amber-900 dark:text-amber-200">{b.name}</p>
                    <StatusBadge status={`${b.utilizationRate}% LOAD`} variant="warning" />
                  </div>
                  <p className="text-[11px] text-amber-700 dark:text-amber-400 mt-1">{b.recommendation}</p>
                </div>
              ))
            ) : (
              <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/50">
                <p className="text-xs font-semibold text-blue-900 dark:text-blue-200">Assembly Welding Station (WC-ASSY-WELD)</p>
                <p className="text-[11px] text-blue-700 dark:text-blue-400 mt-1">
                  Operating at 95% utilization. Queue steady at 180 units. Shift B scheduled.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Pending Requisitions & Approvals */}
        <div className="sap-card p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Pending Requisition Approvals
            </h3>
            <button
              onClick={() => onNavigate('procurement')}
              className="text-xs text-blue-600 dark:text-blue-400 font-semibold hover:underline"
            >
              View All
            </button>
          </div>

          <div className="space-y-2.5">
            {pendingPRs.length > 0 ? (
              pendingPRs.map(pr => (
                <div key={pr._id} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-xs text-slate-800 dark:text-slate-100">{pr.prNumber}</p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      ₹{pr.totalAmount.toLocaleString()} • {pr.items.length} items
                    </p>
                    <p className="text-[10px] text-slate-400">{pr.department}</p>
                  </div>
                  <button
                    onClick={() => onNavigate('procurement')}
                    className="px-2.5 py-1 text-xs rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium shadow-sm transition-colors"
                  >
                    Review
                  </button>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-400 py-4 text-center">No pending purchase approvals.</p>
            )}
          </div>
        </div>

        {/* Recent Audit Activities (SAP Log) */}
        <div className="sap-card p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Live SAP System Audit Trail
            </h3>
            <button
              onClick={() => onNavigate('admin')}
              className="text-xs text-blue-600 dark:text-blue-400 font-semibold hover:underline"
            >
              Basis Logs
            </button>
          </div>

          <div className="space-y-2.5">
            {recentLogs.map((log, idx) => (
              <div key={log.id || idx} className="text-xs border-b border-slate-100 dark:border-slate-800 pb-2 last:border-0 last:pb-0">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-semibold text-blue-600 dark:text-blue-400 font-mono">{log.action}</span>
                  <span className="text-slate-400 font-mono text-[10px]">
                    {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p className="text-slate-600 dark:text-slate-300 text-[11px] mt-0.5 truncate">{log.details}</p>
                <span className="text-[10px] text-slate-400">By {log.user} ({log.module})</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
