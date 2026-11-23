import React from 'react';
import { ShieldAlert, Lock, ArrowRight, ShieldCheck, AlertOctagon } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const AccessDenied = ({ requestedTab, onRedirect }) => {
  const { user, getDefaultTabForRole, ALL_ROLES, ROLE_PERMISSIONS } = useAuth();

  // Find which roles are allowed for the requested tab
  const authorizedRoles = ALL_ROLES.filter(r => (ROLE_PERMISSIONS[r] || []).includes(requestedTab));
  const fallbackTab = getDefaultTabForRole();

  return (
    <div className="sap-card p-8 max-w-2xl mx-auto my-12 text-center border-rose-200 dark:border-rose-900/60 shadow-xl bg-gradient-to-b from-white to-rose-50/20 dark:from-slate-900 dark:to-rose-950/20">
      <div className="w-16 h-16 rounded-2xl bg-rose-100 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900/80 flex items-center justify-center mx-auto text-rose-600 dark:text-rose-400 mb-4 shadow-lg shadow-rose-500/10">
        <ShieldAlert className="w-8 h-8" />
      </div>

      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 text-xs font-mono font-bold mb-3">
        <Lock className="w-3.5 h-3.5" />
        <span>SAP SU53: Authorization Check Failed (Code 403)</span>
      </div>

      <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
        Module Access Restricted
      </h2>

      <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 max-w-md mx-auto leading-relaxed">
        Your current role profile (<strong className="text-slate-800 dark:text-slate-200 font-semibold">{user?.role}</strong>) does not have authorization to view or execute transactions in the <span className="font-mono font-bold uppercase text-blue-600 dark:text-blue-400">{requestedTab}</span> module.
      </p>

      {/* Role Details Card */}
      <div className="mt-6 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-left text-xs space-y-2">
        <div className="flex justify-between py-1 border-b border-slate-200/60 dark:border-slate-700/60">
          <span className="text-slate-500 font-medium">Logged-in User:</span>
          <span className="font-mono font-semibold text-slate-800 dark:text-slate-200">{user?.fullName} ({user?.username})</span>
        </div>
        <div className="flex justify-between py-1 border-b border-slate-200/60 dark:border-slate-700/60">
          <span className="text-slate-500 font-medium">Assigned Role:</span>
          <span className="font-mono font-bold text-rose-600 dark:text-rose-400">{user?.role}</span>
        </div>
        <div className="flex justify-between py-1 border-b border-slate-200/60 dark:border-slate-700/60">
          <span className="text-slate-500 font-medium">Department:</span>
          <span className="text-slate-700 dark:text-slate-300">{user?.department}</span>
        </div>
        <div className="flex justify-between py-1">
          <span className="text-slate-500 font-medium">Authorized Roles:</span>
          <span className="font-mono text-slate-600 dark:text-slate-400 text-[11px] text-right">
            {authorizedRoles.join(', ') || 'Super Admin'}
          </span>
        </div>
      </div>

      {/* Navigation action */}
      <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
        <button
          onClick={() => onRedirect(fallbackTab)}
          className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-all shadow-md shadow-blue-600/20 flex items-center justify-center gap-1.5"
        >
          <span>Go to Authorized Workspace ({fallbackTab})</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <p className="mt-4 text-[11px] text-slate-400">
        💡 To simulate other departments, switch your active persona using the <strong className="text-slate-600 dark:text-slate-300">Role Switcher</strong> in the top header.
      </p>
    </div>
  );
};
