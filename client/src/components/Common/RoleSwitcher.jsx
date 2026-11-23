import React, { useState } from 'react';
import { useAuth, ALL_ROLES } from '../../context/AuthContext';
import { UserCheck, ShieldCheck, ChevronDown, Check } from 'lucide-react';

export const RoleSwitcher = () => {
  const { user, switchRole } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSelectRole = async (role) => {
    if (role === user?.role) {
      setIsOpen(false);
      return;
    }
    setLoading(true);
    try {
      await switchRole(role);
      setIsOpen(false);
    } catch (err) {
      alert(`Role switch error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={loading}
        className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/60 rounded-lg text-blue-700 dark:text-blue-300 text-xs font-medium hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors"
      >
        <ShieldCheck className="w-4 h-4 text-blue-600 dark:text-blue-400" />
        <span className="hidden md:inline">Role:</span>
        <span className="font-semibold">{user?.role || 'Guest'}</span>
        <ChevronDown className="w-3.5 h-3.5 text-blue-500" />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl z-50 py-2 divide-y divide-slate-100 dark:divide-slate-800">
            <div className="px-3 py-2 text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Simulate ERP User Role
            </div>
            <div className="max-h-72 overflow-y-auto py-1">
              {ALL_ROLES.map((role) => {
                const isCurrent = role === user?.role;
                return (
                  <button
                    key={role}
                    onClick={() => handleSelectRole(role)}
                    className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-blue-50 dark:hover:bg-slate-800 transition-colors ${
                      isCurrent ? 'font-semibold text-blue-600 dark:text-blue-400 bg-blue-50/50 dark:bg-slate-800/50' : 'text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <span>{role}</span>
                    {isCurrent && <Check className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />}
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
