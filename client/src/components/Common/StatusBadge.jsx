import React from 'react';

export const StatusBadge = ({ status, variant }) => {
  const statusStr = String(status || '').toUpperCase();

  let styles = 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700';

  if (variant === 'success' || ['CONFIRMED', 'ACTIVE', 'APPROVED', 'ACCEPTED', 'QC PASSED', 'OPERATIONAL', 'RUNNING', 'COMPLETED', 'TECHNICAL COMPLETE (TECO)', 'OPTIMAL', 'DELIVERED', 'CLOSED'].includes(statusStr)) {
    styles = 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800/60';
  } else if (variant === 'warning' || ['PENDING APPROVAL', 'PRODUCTION SCHEDULED', 'IN PRODUCTION', 'IN PROGRESS', 'SUBMITTED', 'REWORK REQUIRED', 'ELEVATED', 'BOTTLENECK', 'ACTION REQUIRED'].includes(statusStr)) {
    styles = 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800/60';
  } else if (variant === 'danger' || ['REJECTED', 'BREAKDOWN', 'CRITICAL', 'CANCELLED', 'OBSOLETE', 'QC REJECTED', 'SEVERE_OVERRUN', 'CRITICAL_CONGESTION'].includes(statusStr)) {
    styles = 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-800/60';
  } else if (variant === 'info' || ['RELEASED', 'CREATED', 'DRAFT', 'PO CREATED', 'UNDER MAINTENANCE', 'PARTIALLY RECEIVED', 'RECEIVED', 'NORMAL'].includes(statusStr)) {
    styles = 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-400 dark:border-blue-800/60';
  }

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium border ${styles} font-mono tracking-tight`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5 opacity-70"></span>
      {status}
    </span>
  );
};
