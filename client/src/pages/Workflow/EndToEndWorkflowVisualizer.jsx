import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { StatusBadge } from '../../components/Common/StatusBadge';
import { 
  GitMerge, 
  ArrowRight, 
  ShoppingCart, 
  Calendar, 
  Layers, 
  Cpu, 
  Truck, 
  CheckCircle, 
  Factory, 
  ShieldCheck, 
  Package, 
  DollarSign,
  Play,
  Sparkles
} from 'lucide-react';

export const EndToEndWorkflowVisualizer = ({ onNavigate }) => {
  const [pipeline, setPipeline] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPipeline();
  }, []);

  const loadPipeline = async () => {
    try {
      setLoading(true);
      const res = await api.getWorkflowPipeline();
      setPipeline(res.data.data);
    } catch (err) {
      console.error('Failed to load workflow pipeline:', err);
    } finally {
      setLoading(false);
    }
  };

  const workflowSteps = [
    {
      id: 'step-1',
      title: 'Customer Order',
      module: 'Sales (SD)',
      icon: ShoppingCart,
      count: pipeline?.totalSalesOrders || 3,
      desc: 'Customer purchase orders confirmed with technical specifications and scheduled delivery dates.',
      nav: 'sales',
      color: 'blue'
    },
    {
      id: 'step-2',
      title: 'Production Planning',
      module: 'PP & BOM',
      icon: Calendar,
      count: pipeline?.totalProductionOrders || 2,
      desc: 'Production orders generated, BOM multi-level components verified, and routing allocated.',
      nav: 'production',
      color: 'indigo'
    },
    {
      id: 'step-3',
      title: 'MRP Calculation',
      module: 'MRP Engine',
      icon: Cpu,
      count: 'Auto-Run',
      desc: 'Demand netting, inventory check, and safety stock shortfall detection with lead times.',
      nav: 'mrp',
      color: 'purple'
    },
    {
      id: 'step-4',
      title: 'Purchase Requisition',
      module: 'MM-PUR',
      icon: Layers,
      count: pipeline?.pendingPRs || 1,
      badge: pipeline?.pendingPRs > 0 ? 'Pending Approval' : 'Balanced',
      desc: 'Automated PR generated from MRP shortages; submitted for Plant Head executive sign-off.',
      nav: 'procurement',
      color: 'amber'
    },
    {
      id: 'step-5',
      title: 'Purchase Order & Vendor',
      module: 'Procurement',
      icon: Truck,
      count: pipeline?.activePOs || 1,
      desc: 'PO placed with verified automotive vendors (JSW Steel, Hindalco, Lincoln Electric).',
      nav: 'procurement',
      color: 'blue'
    },
    {
      id: 'step-6',
      title: 'Goods Receipt & QC',
      module: 'GRN + QM',
      icon: ShieldCheck,
      count: pipeline?.recentGRNs || 1,
      desc: 'GRN created upon raw material arrival, triggering incoming inspection lot and stock update.',
      nav: 'procurement',
      color: 'emerald'
    },
    {
      id: 'step-7',
      title: 'Shop Floor Manufacturing',
      module: 'Production (PP)',
      icon: Factory,
      count: '7 Stages',
      desc: 'Rim → Disc → Assembly → Heat Treatment → Painting → Quality Inspection → Packing.',
      nav: 'production',
      color: 'blue',
      highlight: true
    },
    {
      id: 'step-8',
      title: 'Finished Goods & Dispatch',
      module: 'Warehouse & SD',
      icon: Package,
      count: 'FERT Stock',
      desc: 'Final CMM runout passed, FERT stock recorded in FGW1, and customer dispatch initiated.',
      nav: 'sales',
      color: 'emerald'
    },
    {
      id: 'step-9',
      title: 'Finance & Controlling',
      module: 'FI/CO',
      icon: DollarSign,
      count: 'Variance',
      desc: 'Standard vs Actual cost calculation, scrap variance analysis, and profit center margin audit.',
      nav: 'finance',
      color: 'teal'
    }
  ];

  const stages7 = [
    { name: 'Rim', count: pipeline?.stageBreakdown?.Rim || 0, desc: 'Coiling & Welding' },
    { name: 'Disc', count: pipeline?.stageBreakdown?.Disc || 0, desc: '2500T Hydraulic Press' },
    { name: 'Assembly', count: pipeline?.stageBreakdown?.Assembly || 0, desc: 'Robotic MIG Welding' },
    { name: 'Heat Treatment', count: pipeline?.stageBreakdown?.HeatTreatment || 0, desc: 'T6 Solutionizing Furnace' },
    { name: 'Painting', count: pipeline?.stageBreakdown?.Painting || 0, desc: 'Cathodic CED Line' },
    { name: 'Quality Inspection', count: pipeline?.stageBreakdown?.QualityInspection || 0, desc: 'Dynamic Runout Tester' },
    { name: 'Packing', count: pipeline?.stageBreakdown?.Packing || 0, desc: 'Palletizing & Labeling' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <GitMerge className="w-5 h-5 text-blue-600" />
            <span>End-to-End Enterprise Manufacturing Lifecycle</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Complete business workflow connecting Customer Orders to Dispatch, Finance, and Stage-wise Production
          </p>
        </div>
        <button
          onClick={loadPipeline}
          className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-500 text-white shadow transition-colors flex items-center gap-1.5 self-start"
        >
          <Play className="w-3.5 h-3.5" />
          <span>Refresh Pipeline Telemetry</span>
        </button>
      </div>

      {/* Main Flow Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {workflowSteps.map((step, idx) => {
          const Icon = step.icon;
          return (
            <div
              key={step.id}
              onClick={() => onNavigate(step.nav)}
              className={`sap-card p-4 cursor-pointer relative hover:border-blue-500 transition-all ${
                step.highlight ? 'ring-2 ring-blue-500/50 bg-blue-50/20 dark:bg-blue-950/20' : ''
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="p-2.5 rounded-xl bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-300">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono font-bold uppercase text-slate-400">
                      Phase 0{idx + 1} • {step.module}
                    </span>
                    <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 mt-0.5">
                      {step.title}
                    </h3>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                    {step.count}
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-500 dark:text-slate-400 mt-3 leading-relaxed">
                {step.desc}
              </p>

              <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-blue-600 dark:text-blue-400 font-medium">
                <span>Access Module</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          );
        })}
      </div>

      {/* 7-Stage Manufacturing Sub-Workflow Detail */}
      <div className="sap-card p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <Factory className="w-4 h-4 text-blue-600" />
              <span>Automotive Wheel Manufacturing: 7 Sequential Stages</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Strict stage gate verification: Material scrap tracking, cycle times, and operator sign-off at each work centre.
            </p>
          </div>
          <button
            onClick={() => onNavigate('production')}
            className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1"
          >
            <span>Production Orders Console</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-3">
          {stages7.map((stg, i) => (
            <div key={i} className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 font-bold mb-1">
                  <span>Stage {i + 1}</span>
                  <span className="text-blue-600 dark:text-blue-400">{stg.count} orders</span>
                </div>
                <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">{stg.name}</h4>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">{stg.desc}</p>
              </div>
              <div className="mt-3 pt-2 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between text-[10px] font-medium text-slate-600 dark:text-slate-300">
                <span>Gate {i + 1}</span>
                <span className="text-emerald-600 font-bold">VERIFIED</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
