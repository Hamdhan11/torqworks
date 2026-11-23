import React from 'react';
import { 
  Factory, 
  BrainCircuit, 
  Cpu, 
  ShieldCheck, 
  Layers, 
  ArrowRight, 
  Activity, 
  CheckCircle2, 
  BarChart3, 
  Wrench, 
  TrendingUp, 
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { ALL_ROLES } from '../context/AuthContext';

export const LandingPage = ({ onGoToLogin, onDirectDemoLogin }) => {
  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* Top Header */}
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/30 font-black text-white text-base">
              TQ
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-base tracking-tight bg-gradient-to-r from-white via-cyan-200 to-blue-400 bg-clip-text text-transparent">
                  TORQWORKS
                </span>
                <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded bg-blue-600/30 text-cyan-400 border border-cyan-500/30">
                  ERP 2026
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono">Automotive Wheel Manufacturing & Execution System</p>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-8 text-xs font-medium text-slate-300">
            <a href="#about" className="hover:text-blue-400 transition-colors">About</a>
            <a href="#solutions" className="hover:text-blue-400 transition-colors">Solutions</a>
            <a href="#features" className="hover:text-blue-400 transition-colors">ERP Modules</a>
            <a href="#ai" className="hover:text-blue-400 transition-colors">AI Forecasting</a>
            <a href="#roles" className="hover:text-blue-400 transition-colors">Role Access</a>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onDirectDemoLogin('Super Admin')}
              className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-xl bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/30 transition-all hover:-translate-y-0.5"
            >
              <span>Instant ERP Launch</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={onGoToLogin}
              className="px-4 py-2 text-xs font-semibold rounded-xl border border-slate-700 hover:border-slate-500 text-slate-200 transition-colors"
            >
              Sign In
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-20 pb-28 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(37,99,235,0.25),rgba(255,255,255,0))]" />
        
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-950/60 border border-blue-800/60 text-blue-400 text-xs font-medium mb-8">
            <Sparkles className="w-3.5 h-3.5 text-blue-400 animate-spin" style={{ animationDuration: '4s' }} />
            <span>SAP ERP & Industry 4.0 Architecture for Automotive Component Manufacturing</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight sm:leading-none">
            AI-Assisted Manufacturing <br />
            <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-teal-300 bg-clip-text text-transparent">
              Execution & ERP System
            </span>
          </h1>

          <p className="mt-6 text-base sm:text-lg text-slate-300 max-w-3xl mx-auto leading-relaxed">
            A centralized enterprise platform engineered specifically for automotive wheel and component industries like <strong className="text-white">Wheels India</strong>. Connects Sales, MRP, Production Planning, Procurement, Quality, Maintenance, and Finance to eliminate material shortages, bottlenecks, and cost overruns.
          </p>

          {/* Quick Role Launch Pills */}
          <div className="mt-10 p-6 rounded-2xl bg-slate-800/60 border border-slate-700/80 backdrop-blur max-w-4xl mx-auto">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">
              Explore ERP by Department Role (One-Click Instant Access)
            </p>
            <div className="flex flex-wrap gap-2 justify-center">
              {ALL_ROLES.map((role) => (
                <button
                  key={role}
                  onClick={() => onDirectDemoLogin(role)}
                  className="px-3 py-1.5 text-xs rounded-lg bg-slate-700/60 hover:bg-blue-600 text-slate-200 hover:text-white border border-slate-600/50 hover:border-blue-500 transition-all font-medium flex items-center gap-1.5 group"
                >
                  <span>{role}</span>
                  <ChevronRight className="w-3 h-3 text-slate-400 group-hover:text-white" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 7-Stage Manufacturing Architecture */}
      <section id="solutions" className="py-20 px-6 border-t border-slate-800 bg-slate-900/60">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-mono font-semibold text-blue-400 uppercase tracking-widest">
              Standard Operating Procedure
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mt-2">
              7-Stage Interconnected Wheel Manufacturing
            </h2>
            <p className="text-sm text-slate-400 mt-2">
              Every production order transitions sequentially with automated scrap tracking, cycle times, and quality gates.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-4">
            {[
              { num: '01', title: 'Rim Line', desc: '3-Roll Cold Coiling & Butt Welding', icon: Layers },
              { num: '02', title: 'Disc Press', desc: '2500T Hydraulic Blanking & Piercing', icon: Factory },
              { num: '03', title: 'Assembly', desc: 'Twin Robotic Circumferential MIG', icon: Cpu },
              { num: '04', title: 'Heat Treat', desc: 'Continuous Mesh Belt T6 Furnace', icon: Activity },
              { num: '05', title: 'CED Paint', desc: '8-Stage Cathodic Primer & Baking', icon: Sparkles },
              { num: '06', title: 'Quality Gate', desc: 'Radial/Lateral Dynamic Runout', icon: ShieldCheck },
              { num: '07', title: 'Packing', desc: 'Robotic Palletizing & Dispatch', icon: CheckCircle2 }
            ].map((stg) => {
              const Icon = stg.icon;
              return (
                <div key={stg.num} className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/60 relative overflow-hidden group hover:border-blue-500/50 transition-colors">
                  <div className="text-[10px] font-mono font-bold text-blue-400">{stg.num}</div>
                  <h3 className="text-sm font-semibold text-white mt-1">{stg.title}</h3>
                  <p className="text-xs text-slate-400 mt-1 leading-snug">{stg.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Enterprise Modules Overview */}
      <section id="features" className="py-20 px-6 border-t border-slate-800 bg-slate-950">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-mono font-semibold text-blue-400 uppercase tracking-widest">
              Comprehensive ERP Matrix
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mt-2">
              Fully Integrated Business Modules
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: 'Sales & Distribution (SD)',
                desc: 'Customer Master, Customer Orders, Delivery Scheduling, and dispatch tracking with real-time manufacturing linkage.',
                icon: BarChart3
              },
              {
                title: 'Material Management (MM)',
                desc: 'Raw Material (RM), Semi-Finished (HALB), and Finished (FERT) inventory control with automated low-stock warnings.',
                icon: Layers
              },
              {
                title: 'Bill of Materials (BOM)',
                desc: 'Multi-level BOM explosions with scrap factor calculation, version control, and live unit cost computation.',
                icon: Cpu
              },
              {
                title: 'Material Requirement Planning (MRP)',
                desc: 'Demand netting, lead time calculations, safety stock monitoring, and 1-click Purchase Requisition generation.',
                icon: Activity
              },
              {
                title: 'Procurement (MM-PUR)',
                desc: 'End-to-end purchasing workflow: PR → Plant Head Approval → PO Generation → Vendor Supply → GRN → Quarantine QC.',
                icon: TrendingUp
              },
              {
                title: 'Finance & Controlling (FI/CO)',
                desc: 'Standard vs Actual cost variance analysis, Cost Centre accounting, Profit Centre margins, and scrap impact.',
                icon: Factory
              }
            ].map((m, i) => {
              const Icon = m.icon;
              return (
                <div key={i} className="p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all">
                  <div className="w-10 h-10 rounded-xl bg-blue-900/30 border border-blue-700/50 flex items-center justify-center text-blue-400 mb-4">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-white">{m.title}</h3>
                  <p className="text-xs text-slate-400 mt-2 leading-relaxed">{m.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-800 bg-slate-950 py-12 px-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-300">TORQWORKS ERP</span>
            <span>• Automotive Wheel & Component Engineering System</span>
          </div>
          <p>© 2026 TORQWORKS ERP Platform. Inspired by SAP S/4HANA & Wheels India Manufacturing Excellence.</p>
        </div>
      </footer>
    </div>
  );
};
