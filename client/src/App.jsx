import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { ErpProvider } from './context/ErpContext';
import { Navbar } from './components/Layout/Navbar';
import { Sidebar } from './components/Layout/Sidebar';
import { LandingPage } from './pages/LandingPage';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { EndToEndWorkflowVisualizer } from './pages/Workflow/EndToEndWorkflowVisualizer';
import { ProductionOrders } from './pages/Production/ProductionOrders';
import { BOMManagement } from './pages/BOM/BOMManagement';
import { MRPCalculator } from './pages/MRP/MRPCalculator';
import { SalesOrders } from './pages/Sales/SalesOrders';
import { MaterialMaster } from './pages/Materials/MaterialMaster';
import { ProcurementHub } from './pages/Procurement/ProcurementHub';
import { QualityInspections } from './pages/Quality/QualityInspections';
import { PlantMaintenance } from './pages/Maintenance/PlantMaintenance';
import { FinanceControlling } from './pages/Finance/FinanceControlling';
import { AIAnalytics } from './pages/AIInsights/AIAnalytics';
import { SystemAdmin } from './pages/Admin/SystemAdmin';
import { AccessDenied } from './components/Common/AccessDenied';

const MainAppContent = () => {
  const { user, loading, switchRole, isTabPermitted, getDefaultTabForRole } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showLoginView, setShowLoginView] = useState(false);

  // Auto-redirect to authorized module workspace when role changes
  React.useEffect(() => {
    if (user && !isTabPermitted(activeTab, user.role)) {
      setActiveTab(getDefaultTabForRole(user.role));
    }
  }, [user?.role]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs text-slate-400 font-mono">Initializing TORQWORKS ERP...</p>
        </div>
      </div>
    );
  }

  // If not logged in, show Landing Page or Login View
  if (!user) {
    if (showLoginView) {
      return <Login onCancel={() => setShowLoginView(false)} />;
    }
    return (
      <LandingPage
        onGoToLogin={() => setShowLoginView(true)}
        onDirectDemoLogin={async (role) => {
          try {
            await switchRole(role);
          } catch (err) {
            setShowLoginView(true);
          }
        }}
      />
    );
  }

  // Authenticated ERP Shell with Strict Role-Based Route Guard
  const renderTabContent = () => {
    // If the active tab is not permitted for the user's role, show Access Denied screen
    if (!isTabPermitted(activeTab)) {
      return (
        <AccessDenied
          requestedTab={activeTab}
          onRedirect={(permittedTab) => setActiveTab(permittedTab)}
        />
      );
    }

    switch (activeTab) {
      case 'dashboard':
        return <Dashboard onNavigate={(tab) => setActiveTab(tab)} />;
      case 'workflow':
        return <EndToEndWorkflowVisualizer onNavigate={(tab) => setActiveTab(tab)} />;
      case 'production':
        return <ProductionOrders />;
      case 'bom':
        return <BOMManagement />;
      case 'mrp':
        return <MRPCalculator onNavigate={(tab) => setActiveTab(tab)} />;
      case 'sales':
        return <SalesOrders />;
      case 'materials':
        return <MaterialMaster />;
      case 'procurement':
        return <ProcurementHub />;
      case 'quality':
        return <QualityInspections />;
      case 'maintenance':
        return <PlantMaintenance />;
      case 'finance':
        return <FinanceControlling />;
      case 'ai-insights':
        return <AIAnalytics onNavigate={(tab) => setActiveTab(tab)} />;
      case 'admin':
        return <SystemAdmin />;
      default:
        return <Dashboard onNavigate={(tab) => setActiveTab(tab)} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 font-sans">
      <Navbar 
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} 
        isSidebarOpen={isSidebarOpen} 
      />

      <div className="flex flex-1 relative overflow-hidden">
        <Sidebar
          activeTab={activeTab}
          onSelectTab={(tab) => {
            setActiveTab(tab);
            setIsSidebarOpen(false); // Close on mobile after selection
          }}
          isSidebarOpen={isSidebarOpen}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto overflow-y-auto">
          {renderTabContent()}
        </main>
      </div>
    </div>
  );
};

export const App = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ErpProvider>
          <MainAppContent />
        </ErpProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
