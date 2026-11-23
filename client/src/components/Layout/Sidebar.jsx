import React from 'react';
import { 
  LayoutDashboard, 
  GitMerge, 
  ShoppingCart, 
  Boxes, 
  Layers, 
  Factory, 
  Cpu, 
  Truck, 
  ShieldCheck, 
  Wrench, 
  Calculator, 
  BrainCircuit, 
  Settings2,
  ChevronRight,
  Lock
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const Sidebar = ({ activeTab, onSelectTab, isSidebarOpen }) => {
  const { user, isTabPermitted } = useAuth();

  const navigationItems = [
    {
      id: 'dashboard',
      label: 'Executive Dashboard',
      icon: LayoutDashboard,
      roles: ['Super Admin', 'Plant Head', 'Sales Manager', 'Production Manager', 'Finance Manager']
    },
    {
      id: 'workflow',
      label: 'End-to-End Workflow',
      icon: GitMerge,
      badge: 'Live',
      badgeColor: 'bg-emerald-500 text-white',
      roles: ['Super Admin', 'Plant Head', 'Sales Manager', 'Production Manager', 'Procurement Manager', 'Quality Manager']
    },
    {
      header: 'CORE MANUFACTURING'
    },
    {
      id: 'production',
      label: 'Production Planning (PP)',
      icon: Factory,
      sublabel: '7-Stage Wheel Execution',
      roles: ['Super Admin', 'Plant Head', 'Production Manager', 'Operator']
    },
    {
      id: 'bom',
      label: 'Bill of Materials (BOM)',
      icon: Layers,
      roles: ['Super Admin', 'Plant Head', 'Production Manager', 'Store Manager']
    },
    {
      id: 'mrp',
      label: 'MRP Engine',
      icon: Cpu,
      badge: 'Shortages',
      badgeColor: 'bg-rose-500 text-white',
      roles: ['Super Admin', 'Plant Head', 'Production Manager', 'Procurement Manager', 'Store Manager']
    },
    {
      header: 'SUPPLY CHAIN & STORES'
    },
    {
      id: 'sales',
      label: 'Sales Management (SD)',
      icon: ShoppingCart,
      roles: ['Super Admin', 'Plant Head', 'Sales Manager', 'Finance Manager']
    },
    {
      id: 'materials',
      label: 'Materials & Stock (MM)',
      icon: Boxes,
      roles: ['Super Admin', 'Plant Head', 'Store Manager', 'Production Manager']
    },
    {
      id: 'procurement',
      label: 'Procurement (MM-PUR)',
      icon: Truck,
      roles: ['Super Admin', 'Plant Head', 'Procurement Manager', 'Store Manager']
    },
    {
      header: 'QUALITY & ASSETS'
    },
    {
      id: 'quality',
      label: 'Quality Management (QM)',
      icon: ShieldCheck,
      roles: ['Super Admin', 'Plant Head', 'Quality Manager', 'Production Manager']
    },
    {
      id: 'maintenance',
      label: 'Plant Maintenance (PM)',
      icon: Wrench,
      roles: ['Super Admin', 'Plant Head', 'Maintenance Manager']
    },
    {
      header: 'CONTROLLING & AI'
    },
    {
      id: 'finance',
      label: 'Finance & Controlling (CO)',
      icon: Calculator,
      roles: ['Super Admin', 'Plant Head', 'Finance Manager']
    },
    {
      id: 'ai-insights',
      label: 'AI Predictive Hub',
      icon: BrainCircuit,
      badge: 'AI Core',
      badgeColor: 'bg-indigo-500 text-white',
      roles: ['Super Admin', 'Plant Head', 'Production Manager', 'Maintenance Manager', 'Finance Manager']
    },
    {
      id: 'admin',
      label: 'SAP Basis & Audit',
      icon: Settings2,
      roles: ['Super Admin', 'Plant Head']
    }
  ];

  return (
    <aside className={`
      fixed lg:static top-16 bottom-0 left-0 z-20
      w-64 bg-slate-900 text-slate-300 border-r border-slate-800
      transform transition-transform duration-200 ease-in-out
      ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      flex flex-col justify-between overflow-y-auto
    `}>
      <div className="py-4 px-3 space-y-1">
        {navigationItems.map((item, idx) => {
          if (item.header) {
            return (
              <div 
                key={`hdr-${idx}`}
                className="pt-4 pb-1.5 px-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest"
              >
                {item.header}
              </div>
            );
          }

          const isAuthorized = isTabPermitted(item.id);
          const isActive = activeTab === item.id;
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`
                w-full text-left px-3 py-2.5 rounded-xl text-xs font-medium
                flex items-center justify-between group transition-all duration-150
                ${isActive 
                  ? 'bg-blue-600 text-white font-semibold shadow-md shadow-blue-600/30' 
                  : isAuthorized
                  ? 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                  : 'text-slate-500 hover:text-slate-400 hover:bg-slate-900/60 opacity-60'}
              `}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : isAuthorized ? 'text-slate-400 group-hover:text-blue-400' : 'text-slate-600'}`} />
                <div className="truncate">
                  <span className="truncate block">{item.label}</span>
                </div>
              </div>

              {isAuthorized ? (
                item.badge && (
                  <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wider shrink-0 ${item.badgeColor || 'bg-blue-500 text-white'}`}>
                    {item.badge}
                  </span>
                )
              ) : (
                <span className="flex items-center gap-1 text-[9px] font-mono font-semibold px-1.5 py-0.5 rounded bg-slate-800/80 text-rose-400/80 border border-slate-700/60 shrink-0">
                  <Lock className="w-2.5 h-2.5" />
                  <span>Locked</span>
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Footer Info */}
      <div className="p-3 m-3 bg-slate-800/50 rounded-xl border border-slate-800 text-[11px] text-slate-400">
        <div className="flex items-center justify-between">
          <span className="font-semibold text-slate-200">Active Profile</span>
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        </div>
        <p className="mt-1 font-mono text-slate-300 truncate">{user?.fullName}</p>
        <p className="text-[10px] text-slate-400 truncate">{user?.department}</p>
      </div>
    </aside>
  );
};
