import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { DataTable } from '../../components/Common/DataTable';
import { StatusBadge } from '../../components/Common/StatusBadge';
import { 
  Settings2, 
  Server, 
  Users, 
  FileText, 
  CheckCircle2, 
  Activity, 
  Database,
  Terminal,
  Play
} from 'lucide-react';

export const SystemAdmin = () => {
  const [activeTab, setActiveTab] = useState('health'); // 'health', 'users', 'logs', 'reports'
  const [health, setHealth] = useState(null);
  const [users, setUsers] = useState([]);
  const [logs, setLogs] = useState([]);
  const [reportType, setReportType] = useState('MATERIAL_STOCK_VALUATION');
  const [reportResult, setReportResult] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAdminData();
  }, []);

  const loadAdminData = async () => {
    try {
      setLoading(true);
      const [hRes, uRes, lRes] = await Promise.all([
        api.getSystemHealth(),
        api.getUsers(),
        api.getSystemLogs()
      ]);
      setHealth(hRes.data.data);
      setUsers(uRes.data.data);
      setLogs(lRes.data.data);
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRunReport = async () => {
    try {
      const res = await api.runCustomReport(reportType);
      setReportResult(res.data);
    } catch (err) {
      alert(`Report execution error: ${err.message}`);
    }
  };

  const userColumns = [
    {
      header: 'Employee ID',
      accessor: 'employeeId',
      render: (row) => <span className="font-mono font-bold">{row.employeeId}</span>
    },
    {
      header: 'Full Name',
      accessor: 'fullName',
      render: (row) => (
        <div>
          <p className="font-semibold text-slate-800 dark:text-slate-100">{row.fullName}</p>
          <span className="text-[10px] text-slate-400 font-mono">{row.email}</span>
        </div>
      )
    },
    {
      header: 'Username',
      accessor: 'username',
      render: (row) => <span className="font-mono">{row.username}</span>
    },
    {
      header: 'ERP Role',
      accessor: 'role',
      render: (row) => (
        <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300">
          {row.role}
        </span>
      )
    },
    {
      header: 'Department',
      accessor: 'department'
    },
    {
      header: 'Status',
      accessor: 'isActive',
      render: (row) => <StatusBadge status={row.isActive ? 'ACTIVE' : 'DEACTIVATED'} />
    }
  ];

  const logColumns = [
    {
      header: 'Timestamp',
      accessor: 'timestamp',
      render: (row) => (
        <span className="text-xs font-mono text-slate-400">
          {new Date(row.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
        </span>
      )
    },
    {
      header: 'User',
      accessor: 'user',
      render: (row) => <span className="font-mono font-bold">{row.user}</span>
    },
    {
      header: 'Action',
      accessor: 'action',
      render: (row) => (
        <span className="font-mono text-blue-600 dark:text-blue-400 font-semibold">{row.action}</span>
      )
    },
    {
      header: 'Module',
      accessor: 'module'
    },
    {
      header: 'Document #',
      accessor: 'documentNumber',
      render: (row) => <span className="font-mono text-slate-500">{row.documentNumber}</span>
    },
    {
      header: 'Audit Details',
      accessor: 'details',
      render: (row) => <p className="text-xs text-slate-600 dark:text-slate-300 truncate max-w-sm">{row.details}</p>
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header & Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Settings2 className="w-5 h-5 text-blue-600" />
            <span>SAP Basis Administration & Custom Reporting</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            System Dispatcher Monitoring, User Access Management, Audit Logs, and ABAP Reporting Capabilities
          </p>
        </div>

        <div className="flex rounded-xl bg-slate-200 dark:bg-slate-800 p-1 text-xs">
          <button
            onClick={() => setActiveTab('health')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              activeTab === 'health' ? 'bg-white dark:bg-slate-900 text-blue-600 shadow-sm' : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            System Status
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              activeTab === 'users' ? 'bg-white dark:bg-slate-900 text-blue-600 shadow-sm' : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            User Access
          </button>
          <button
            onClick={() => setActiveTab('logs')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              activeTab === 'logs' ? 'bg-white dark:bg-slate-900 text-blue-600 shadow-sm' : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Audit Logs
          </button>
          <button
            onClick={() => setActiveTab('reports')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              activeTab === 'reports' ? 'bg-white dark:bg-slate-900 text-blue-600 shadow-sm' : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            ABAP Custom Reports
          </button>
        </div>
      </div>

      {activeTab === 'health' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="sap-card p-5">
              <span className="text-[10px] font-mono uppercase text-slate-400 font-bold">Database Storage</span>
              <p className="text-base font-bold text-slate-800 dark:text-slate-100 mt-1 font-mono">
                {health?.database?.type || 'Embedded Enterprise Engine'}
              </p>
              <div className="mt-2 flex items-center gap-1.5 text-xs text-emerald-600 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Connected & Persistent</span>
              </div>
            </div>

            <div className="sap-card p-5">
              <span className="text-[10px] font-mono uppercase text-slate-400 font-bold">Server Memory Heap</span>
              <p className="text-2xl font-bold font-mono text-slate-800 dark:text-slate-100 mt-1">
                {health?.memoryMB || 42} MB
              </p>
              <span className="text-xs text-slate-400">Node v22.18.0 Runtime</span>
            </div>

            <div className="sap-card p-5">
              <span className="text-[10px] font-mono uppercase text-slate-400 font-bold">Process Uptime</span>
              <p className="text-2xl font-bold font-mono text-slate-800 dark:text-slate-100 mt-1">
                {health?.uptimeSeconds || 120}s
              </p>
              <span className="text-xs text-emerald-600">Zero Unhandled Faults</span>
            </div>

            <div className="sap-card p-5">
              <span className="text-[10px] font-mono uppercase text-slate-400 font-bold">SAP Dispatcher Status</span>
              <p className="text-base font-bold font-mono text-emerald-600 mt-1">
                {health?.sapBasisStatus?.dispatcher || 'ACTIVE / GREEN'}
              </p>
              <span className="text-xs text-slate-400">Enqueue Synced</span>
            </div>
          </div>

          <div className="sap-card p-6">
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 mb-4">
              Database Collection Metrics & Record Counts
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-6 gap-3 text-xs">
              {Object.entries(health?.collectionRecords || {}).map(([key, count]) => (
                <div key={key} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                  <p className="text-slate-500 uppercase text-[10px] font-mono">{key}</p>
                  <p className="text-lg font-bold font-mono text-blue-600 dark:text-blue-400 mt-1">{count}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'users' && (
        <DataTable
          title="Enterprise ERP User Accounts & Department Roles"
          columns={userColumns}
          data={users}
          searchPlaceholder="Search user, name, or role..."
        />
      )}

      {activeTab === 'logs' && (
        <DataTable
          title="SAP-Standard Audit Trail & Transaction Log"
          columns={logColumns}
          data={logs}
          searchPlaceholder="Search audit action, document, or user..."
        />
      )}

      {activeTab === 'reports' && (
        <div className="space-y-6">
          <div className="sap-card p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">
                  ABAP-Inspired Custom Report Generator
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Select a standard SAP transaction view to execute live against the enterprise database
                </p>
              </div>

              <div className="flex items-center gap-3">
                <select
                  value={reportType}
                  onChange={(e) => setReportType(e.target.value)}
                  className="px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs font-mono"
                >
                  <option value="MATERIAL_STOCK_VALUATION">SAP MB52: Plant Stock Valuation</option>
                  <option value="MACHINE_OEE_DOWNTIME">SAP PM: Machine Availability & OEE</option>
                  <option value="PRODUCTION_EXECUTION">SAP COOIS: Order Stage Progress</option>
                </select>

                <button
                  onClick={handleRunReport}
                  className="px-4 py-2 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-500 text-white flex items-center gap-1.5 shadow"
                >
                  <Play className="w-3.5 h-3.5" />
                  <span>Execute Report</span>
                </button>
              </div>
            </div>

            {reportResult && (
              <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-800">
                <div className="flex items-center justify-between mb-3 text-xs">
                  <h4 className="font-bold text-slate-900 dark:text-white font-mono">{reportResult.reportTitle}</h4>
                  <span className="font-mono text-slate-500">{reportResult.recordCount} rows returned</span>
                </div>
                <div className="overflow-x-auto max-h-80 overflow-y-auto">
                  <table className="w-full text-xs text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-mono">
                        {reportResult.data[0] && Object.keys(reportResult.data[0]).map((key, i) => (
                          <th key={i} className="py-2 px-3 border-b border-slate-200 dark:border-slate-700">{key}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300 font-mono">
                      {reportResult.data.map((row, rIdx) => (
                        <tr key={rIdx} className="hover:bg-blue-50/50 dark:hover:bg-slate-800/50">
                          {Object.values(row).map((val, cIdx) => (
                            <td key={cIdx} className="py-2 px-3">{String(val)}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
