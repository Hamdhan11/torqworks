import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useErp } from '../../context/ErpContext';
import { RoleSwitcher } from '../Common/RoleSwitcher';
import { 
  Sun, Moon, Bell, LogOut, CheckCircle2, Factory, 
  Menu, X, Sparkles, ExternalLink 
} from 'lucide-react';

export const Navbar = ({ onToggleSidebar, isSidebarOpen }) => {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const { notifications, unreadCount, markAsRead } = useErp();
  const [showNotifs, setShowNotifs] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  return (
    <header className="sticky top-0 z-30 h-16 bg-white/95 dark:bg-slate-900/95 backdrop-blur border-b border-slate-200 dark:border-slate-800 px-4 flex items-center justify-between">
      {/* Left brand & toggle */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="p-2 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 lg:hidden"
        >
          {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>

        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 flex items-center justify-center shadow-md shadow-blue-500/25 text-white font-black text-sm tracking-tighter">
            TQ
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-extrabold text-sm tracking-tight text-slate-900 dark:text-white flex items-center gap-1.5">
                <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 bg-clip-text text-transparent dark:from-blue-400 dark:via-cyan-300 dark:to-teal-300">
                  TORQWORKS
                </span>
                <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-blue-100 text-blue-700 dark:bg-cyan-950/80 dark:text-cyan-300 border border-blue-200 dark:border-cyan-800/60">
                  ERP
                </span>
              </h1>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
              <Factory className="w-3 h-3 text-emerald-500" />
              <span>Plant 01: Wheels India Facility</span>
            </p>
          </div>
        </div>
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-2.5 sm:gap-3">
        {/* Role Switcher */}
        <RoleSwitcher />

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifs(!showNotifs)}
            className="p-2 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 relative transition-colors"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifs && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowNotifs(false)} />
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-2xl z-50 overflow-hidden">
                <div className="px-4 py-3 bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                  <h4 className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                    ERP Alerts & Notifications ({unreadCount} unread)
                  </h4>
                  <span className="text-[11px] text-blue-600 dark:text-blue-400 font-mono">Live</span>
                </div>

                <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
                  {notifications.length > 0 ? (
                    notifications.map(n => (
                      <div
                        key={n.id}
                        className={`p-3 text-xs transition-colors ${n.isRead ? 'opacity-60 bg-white dark:bg-slate-900' : 'bg-blue-50/40 dark:bg-slate-800/40'}`}
                        onClick={() => markAsRead(n.id)}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <p className="font-semibold text-slate-800 dark:text-slate-100">{n.title}</p>
                          {!n.isRead && <span className="w-2 h-2 rounded-full bg-blue-600 mt-1 shrink-0" />}
                        </div>
                        <p className="text-slate-500 dark:text-slate-400 mt-1 text-[11px] leading-relaxed">{n.message}</p>
                        <span className="text-[10px] text-slate-400 mt-2 block font-mono">
                          {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="p-6 text-center text-xs text-slate-400">
                      No notifications active.
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
          className="p-2 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
        </button>

        {/* User Profile */}
        <div className="relative">
          <button
            onClick={() => setShowProfile(!showProfile)}
            className="flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-800 text-left"
          >
            <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
              {user?.fullName?.charAt(0) || 'U'}
            </div>
            <div className="hidden sm:block text-xs">
              <p className="font-semibold text-slate-800 dark:text-slate-200 leading-tight">
                {user?.fullName?.split(' ')[0] || 'User'}
              </p>
              <p className="text-[10px] text-slate-400">{user?.role || 'Guest'}</p>
            </div>
          </button>

          {showProfile && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowProfile(false)} />
              <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl z-50 p-2 text-xs">
                <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800">
                  <p className="font-semibold text-slate-800 dark:text-slate-100">{user?.fullName}</p>
                  <p className="text-[11px] text-slate-400 font-mono">{user?.employeeId} • {user?.department}</p>
                </div>
                <button
                  onClick={logout}
                  className="w-full mt-1 px-3 py-2 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg flex items-center gap-2 font-medium transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
