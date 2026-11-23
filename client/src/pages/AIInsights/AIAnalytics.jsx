import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { StatusBadge } from '../../components/Common/StatusBadge';
import { 
  BrainCircuit, 
  AlertTriangle, 
  Clock, 
  Cpu, 
  Flame, 
  DollarSign, 
  CheckCircle,
  RefreshCw,
  Sparkles
} from 'lucide-react';

export const AIAnalytics = ({ onNavigate }) => {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAISummary();
  }, []);

  const loadAISummary = async () => {
    try {
      setLoading(true);
      const res = await api.getAISummary();
      setSummary(res.data.data);
    } catch (err) {
      console.error('Failed to load AI summary:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <BrainCircuit className="w-5 h-5 text-indigo-500" />
            <span>AI Predictive Intelligence Hub</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Rule-based predictive recommendations (Scikit-learn / Python ML integration ready)
          </p>
        </div>

        <button
          onClick={loadAISummary}
          className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white shadow transition-colors flex items-center gap-1.5 self-start"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh AI Predictions</span>
        </button>
      </div>

      {/* 5 AI Forecast Dimensions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 1. Material Shortage Forecast */}
        <div className="sap-card p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-rose-100 dark:bg-rose-900/40 text-rose-600">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Material Shortage & Stockout Prediction
              </h3>
            </div>
            <span className="text-[10px] font-mono font-bold text-rose-500">
              {summary?.shortages?.length || 0} at risk
            </span>
          </div>

          <div className="space-y-3">
            {summary?.shortages?.map((item, idx) => (
              <div key={idx} className="p-3.5 rounded-xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/50 text-xs">
                <div className="flex items-center justify-between font-semibold">
                  <span className="text-rose-900 dark:text-rose-200 font-mono">{item.materialCode}</span>
                  <StatusBadge status={item.riskLevel} variant="danger" />
                </div>
                <p className="text-slate-600 dark:text-slate-300 mt-1">{item.materialName}</p>
                <div className="mt-2 text-[11px] flex items-center gap-4 text-slate-500 font-mono">
                  <span>Current: <strong>{item.currentStock}</strong></span>
                  <span>Safety: <strong>{item.safetyStock}</strong></span>
                  <span>Stockout Window: <strong className="text-rose-600">{item.estimatedDaysUntilStockout} days</strong></span>
                </div>
                <p className="mt-2 pt-2 border-t border-rose-200/50 dark:border-rose-900/50 text-[11px] text-blue-700 dark:text-blue-300">
                  💡 <strong>AI Recommendation:</strong> {item.aiRecommendation}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* 2. Production Delay Risk */}
        <div className="sap-card p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-900/40 text-amber-600">
                <Clock className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Production Delay & Delivery Risk
              </h3>
            </div>
            <span className="text-[10px] font-mono font-bold text-amber-500">
              {summary?.delays?.filter(d => d.delayRisk === 'HIGH').length || 0} high risk
            </span>
          </div>

          <div className="space-y-3">
            {summary?.delays?.map((item, idx) => (
              <div key={idx} className="p-3.5 rounded-xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/50 text-xs">
                <div className="flex items-center justify-between font-semibold">
                  <span className="text-amber-900 dark:text-amber-200 font-mono">{item.productionOrderNumber}</span>
                  <StatusBadge status={`${item.probabilityPercent}% RISK`} variant={item.delayRisk === 'HIGH' ? 'danger' : 'warning'} />
                </div>
                <p className="text-slate-700 dark:text-slate-200 mt-1 font-medium">{item.productName}</p>
                <div className="mt-2 text-[11px] flex items-center gap-4 text-slate-500 font-mono">
                  <span>Current Stage: <strong>{item.currentStage}</strong></span>
                  <span>Due in: <strong>{item.daysRemainingUntilDueDate} days</strong></span>
                  <span>Estimated needed: <strong>{item.estimatedDaysNeeded} days</strong></span>
                </div>
                <p className="mt-2 pt-2 border-t border-amber-200/50 dark:border-amber-900/50 text-[11px] text-slate-700 dark:text-slate-300">
                  💡 <strong>Action:</strong> {item.aiMitigationAction}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* 3. Machine Failure & Predictive Maintenance */}
        <div className="sap-card p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600">
                <Cpu className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Machine Failure & Health Degradation Risk
              </h3>
            </div>
          </div>

          <div className="space-y-3">
            {summary?.machines?.slice(0, 3).map((item, idx) => (
              <div key={idx} className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs">
                <div className="flex items-center justify-between font-semibold">
                  <span className="font-mono text-slate-800 dark:text-slate-200">{item.machineCode}</span>
                  <StatusBadge status={`${item.failureProbabilityPercent}% PROBABILITY`} variant={item.riskTier === 'CRITICAL' ? 'danger' : 'warning'} />
                </div>
                <p className="text-slate-600 dark:text-slate-300 mt-1">{item.machineName}</p>
                <p className="mt-2 text-[11px] text-blue-600 dark:text-blue-400">
                  🔧 {item.recommendedAction}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* 4. Production Bottleneck Analysis */}
        <div className="sap-card p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-900/40 text-amber-600">
                <Flame className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Shop Floor Bottlenecks
              </h3>
            </div>
          </div>

          <div className="space-y-3">
            {summary?.bottlenecks?.map((item, idx) => (
              <div key={idx} className="p-3.5 rounded-xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/50 text-xs">
                <div className="flex items-center justify-between font-semibold">
                  <span className="text-amber-900 dark:text-amber-200 font-mono">{item.workCentreCode}</span>
                  <StatusBadge status={`${item.utilizationRate}% LOAD`} variant="warning" />
                </div>
                <p className="text-slate-700 dark:text-slate-200 mt-1 font-medium">{item.name}</p>
                <div className="mt-1 text-[11px] text-slate-500 font-mono">
                  Queue: {item.totalUnitsQueued} units • Capacity: {item.capacityPerShift}/shift
                </div>
                <p className="mt-2 text-[11px] text-amber-800 dark:text-amber-300">
                  💡 {item.recommendation}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
