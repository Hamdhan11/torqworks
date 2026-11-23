import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext();

export const ALL_ROLES = [
  'Super Admin',
  'Plant Head',
  'Sales Manager',
  'Production Manager',
  'Store Manager',
  'Procurement Manager',
  'Quality Manager',
  'Maintenance Manager',
  'Finance Manager',
  'Operator'
];

export const ROLE_PERMISSIONS = {
  'Super Admin': ['dashboard', 'workflow', 'production', 'bom', 'mrp', 'sales', 'materials', 'procurement', 'quality', 'maintenance', 'finance', 'ai-insights', 'admin'],
  'Plant Head': ['dashboard', 'workflow', 'production', 'bom', 'mrp', 'sales', 'materials', 'procurement', 'quality', 'maintenance', 'finance', 'ai-insights', 'admin'],
  'Sales Manager': ['sales', 'dashboard', 'workflow'],
  'Production Manager': ['production', 'bom', 'mrp', 'materials', 'quality', 'ai-insights', 'dashboard', 'workflow'],
  'Store Manager': ['materials', 'bom', 'mrp', 'procurement'],
  'Procurement Manager': ['procurement', 'materials', 'mrp', 'workflow'],
  'Quality Manager': ['quality', 'production', 'workflow'],
  'Maintenance Manager': ['maintenance', 'ai-insights'],
  'Finance Manager': ['finance', 'dashboard', 'sales'],
  'Operator': ['production']
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('smart_erp_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('smart_erp_token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyUser = async () => {
      if (token) {
        try {
          const res = await api.getMe();
          setUser(res.data.user);
          localStorage.setItem('smart_erp_user', JSON.stringify(res.data.user));
        } catch (err) {
          console.error('Failed to verify token:', err);
          logout();
        }
      }
      setLoading(false);
    };
    verifyUser();
  }, [token]);

  const login = async (username, password) => {
    const res = await api.login({ username, password });
    if (res.data.success) {
      setToken(res.data.token);
      setUser(res.data.user);
      localStorage.setItem('smart_erp_token', res.data.token);
      localStorage.setItem('smart_erp_user', JSON.stringify(res.data.user));
      return res.data.user;
    }
  };

  const switchRole = async (targetRole) => {
    try {
      const res = await api.switchRole(targetRole);
      if (res.data.success) {
        setToken(res.data.token);
        setUser(res.data.user);
        localStorage.setItem('smart_erp_token', res.data.token);
        localStorage.setItem('smart_erp_user', JSON.stringify(res.data.user));
        return res.data.user;
      }
    } catch (err) {
      console.error('Role switch failed:', err);
      throw err;
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('smart_erp_token');
    localStorage.removeItem('smart_erp_user');
  };

  const isTabPermitted = (tabId, role = user?.role) => {
    if (!role) return false;
    const permitted = ROLE_PERMISSIONS[role] || [];
    return permitted.includes(tabId);
  };

  const getDefaultTabForRole = (role = user?.role) => {
    const permitted = ROLE_PERMISSIONS[role] || [];
    return permitted[0] || 'production';
  };

  const hasAccess = (allowedRoles) => {
    if (!user) return false;
    if (user.role === 'Super Admin') return true;
    return allowedRoles.includes(user.role);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      token, 
      loading, 
      login, 
      logout, 
      switchRole, 
      hasAccess, 
      isTabPermitted,
      getDefaultTabForRole,
      ROLE_PERMISSIONS,
      ALL_ROLES 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
