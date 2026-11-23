import axios from 'axios';

const API = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor to attach JWT token
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('smart_erp_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => Promise.reject(error));

// Response interceptor for handling 401s
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Don't auto-redirect on login attempt failure
      if (!error.config.url.includes('/auth/login')) {
        console.warn('Session expired or unauthorized');
      }
    }
    return Promise.reject(error);
  }
);

export const api = {
  // Auth
  login: (credentials) => API.post('/auth/login', credentials),
  switchRole: (targetRole) => API.post('/auth/switch-role', { targetRole }),
  getMe: () => API.get('/auth/me'),

  // Sales (SD)
  getCustomers: () => API.get('/sales/customers'),
  createCustomer: (data) => API.post('/sales/customers', data),
  getSalesOrders: () => API.get('/sales/orders'),
  createSalesOrder: (data) => API.post('/sales/orders', data),
  updateOrderStatus: (id, data) => API.put(`/sales/orders/${id}/status`, data),

  // Materials (MM)
  getMaterials: (type) => API.get('/materials', { params: { type } }),
  createMaterial: (data) => API.post('/materials', data),
  transferStock: (data) => API.post('/materials/transfer', data),
  getStockMovements: () => API.get('/materials/movements'),

  // BOM
  getBOMs: () => API.get('/bom'),
  createBOM: (data) => API.post('/bom', data),

  // Production (PP)
  getProductionOrders: () => API.get('/production/orders'),
  createProductionOrder: (data) => API.post('/production/orders', data),
  releaseProductionOrder: (id) => API.put(`/production/orders/${id}/release`),
  advanceProductionStage: (id, data) => API.put(`/production/orders/${id}/advance`, data),
  getWorkCentres: () => API.get('/production/workcentres'),
  getRoutings: () => API.get('/production/routings'),

  // MRP
  runMRP: () => API.get('/mrp/run'),
  createPRFromMRP: (shortageItems) => API.post('/mrp/generate-pr', { shortageItems }),

  // Procurement (MM-PUR)
  getPRs: () => API.get('/procurement/prs'),
  createPR: (data) => API.post('/procurement/prs', data),
  approvePR: (id, action) => API.put(`/procurement/prs/${id}/approve`, { action }),
  getPOs: () => API.get('/procurement/pos'),
  createPOFromPR: (data) => API.post('/procurement/pos/from-pr', data),
  getGRNs: () => API.get('/procurement/grns'),
  createGRN: (data) => API.post('/procurement/grns', data),
  getVendors: () => API.get('/procurement/vendors'),

  // Quality (QM)
  getInspections: () => API.get('/quality/inspections'),
  createInspection: (data) => API.post('/quality/inspections', data),

  // Maintenance (PM)
  getMachines: () => API.get('/maintenance/machines'),
  updateMachineStatus: (id, data) => API.put(`/maintenance/machines/${id}/status`, data),
  getMaintenanceOrders: () => API.get('/maintenance/orders'),
  createMaintenanceOrder: (data) => API.post('/maintenance/orders', data),
  getDowntimeLogs: () => API.get('/maintenance/downtime'),
  logDowntime: (data) => API.post('/maintenance/downtime', data),

  // Finance (FI/CO)
  getCostCentres: () => API.get('/finance/cost-centres'),
  getProfitCentres: () => API.get('/finance/profit-centres'),
  getCostRecords: () => API.get('/finance/cost-records'),
  getFinanceAnalysis: () => API.get('/finance/analysis'),

  // Admin & Basis
  getUsers: () => API.get('/admin/users'),
  getSystemLogs: () => API.get('/admin/logs'),
  getSystemHealth: () => API.get('/admin/health'),
  runCustomReport: (reportType) => API.post('/admin/report', { reportType }),

  // AI Intelligence
  getAISummary: () => API.get('/ai/summary'),
  getShortagePredictions: () => API.get('/ai/shortages'),
  getDelayPredictions: () => API.get('/ai/delays'),
  getMachinePredictions: () => API.get('/ai/machines'),
  getBottlenecks: () => API.get('/ai/bottlenecks'),
  getCostOverruns: () => API.get('/ai/overruns'),

  // Notifications & Workflow Pipeline
  getNotifications: () => API.get('/notifications'),
  markNotificationRead: (id) => API.put(`/notifications/${id}/read`),
  getWorkflowPipeline: () => API.get('/workflow/pipeline')
};
