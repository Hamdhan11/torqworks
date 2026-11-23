import React, { useState } from 'react';
import { useAuth, ALL_ROLES } from '../context/AuthContext';
import { Factory, Lock, User, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';

export const Login = ({ onCancel }) => {
  const { login, switchRole } = useAuth();
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('password123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(username, password);
    } catch (err) {
      setError(err.response?.data?.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickRoleLogin = async (role) => {
    setError('');
    setLoading(true);
    try {
      await switchRole(role);
    } catch (err) {
      setError(`Quick role login failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 selection:bg-blue-600 selection:text-white">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden p-8">
        {/* Brand */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 flex items-center justify-center text-white font-black text-xl mx-auto shadow-lg shadow-blue-500/30 mb-3">
            TQ
          </div>
          <h2 className="text-xl font-black text-white tracking-tight flex items-center justify-center gap-2">
            <span>TORQWORKS</span>
            <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-blue-600/30 text-cyan-400 border border-cyan-500/30">
              ERP
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">Automotive Wheel Manufacturing & Execution System</p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-950/50 border border-rose-800/80 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Credentials Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Username / SAP ID</label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full pl-9 pr-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g. admin or prodmgr"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-9 pr-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-all shadow-md shadow-blue-600/30 flex items-center justify-center gap-1.5 disabled:opacity-50"
          >
            <span>{loading ? 'Authenticating...' : 'Sign In to ERP'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>

        {/* 1-Click Role Switcher */}
        <div className="mt-6 pt-6 border-t border-slate-800">
          <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider text-center mb-3">
            Instant Demo Sign-in by Role
          </p>
          <div className="grid grid-cols-2 gap-1.5">
            {ALL_ROLES.slice(0, 8).map((role) => (
              <button
                key={role}
                type="button"
                onClick={() => handleQuickRoleLogin(role)}
                className="px-2 py-1.5 text-[11px] text-slate-300 bg-slate-800/80 hover:bg-slate-700 border border-slate-700/60 rounded-lg text-left truncate transition-colors flex items-center gap-1.5"
              >
                <ShieldCheck className="w-3 h-3 text-blue-400 shrink-0" />
                <span className="truncate">{role}</span>
              </button>
            ))}
          </div>
        </div>

        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="w-full mt-4 text-center text-xs text-slate-500 hover:text-slate-300"
          >
            ← Return to Landing Page
          </button>
        )}
      </div>
    </div>
  );
};
