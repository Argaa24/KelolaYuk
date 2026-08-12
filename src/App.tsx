import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { Toast } from './components/Toast';

// Views
import { DashboardView } from './components/views/DashboardView';
import { CashFlowView } from './components/views/CashFlowView';
import { BudgetView } from './components/views/BudgetView';
import { SavingsView } from './components/views/SavingsView';
import { CalculatorView } from './components/views/CalculatorView';
import { AcademyView } from './components/views/AcademyView';
import { BillsView } from './components/views/BillsView';
import { AuthView } from './components/views/AuthView';

// Modals
import { AddTransactionModal } from './components/modals/AddTransactionModal';
import { AddSavingsModal } from './components/modals/AddSavingsModal';
import { AddGoalModal } from './components/modals/AddGoalModal';
import { AddBillModal } from './components/modals/AddBillModal';
import { QuizModal } from './components/modals/QuizModal';

const MainContent: React.FC = () => {
  const { currentView } = useApp();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <DashboardView />;
      case 'cashflow':
        return <CashFlowView />;
      case 'budget':
        return <BudgetView />;
      case 'savings':
        return <SavingsView />;
      case 'calculator':
        return <CalculatorView />;
      case 'academy':
        return <AcademyView />;
      case 'bills':
        return <BillsView />;
      case 'auth':
        return <AuthView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="min-h-screen bg-[#f4faff] text-[#0e1d25]">
      {/* Navigation Sidebar */}
      <Sidebar 
        isOpenMobile={isMobileMenuOpen} 
        onCloseMobile={() => setIsMobileMenuOpen(false)} 
      />

      {/* Header */}
      <Header onOpenMobileMenu={() => setIsMobileMenuOpen(true)} />

      {/* Main View Area */}
      <main className="pt-24 pb-12 px-4 sm:px-6 md:px-10 md:ml-72 transition-all">
        <div className="max-w-7xl mx-auto">
          {renderView()}
        </div>
      </main>

      {/* Global Modals */}
      <AddTransactionModal />
      <AddSavingsModal />
      <AddGoalModal />
      <AddBillModal />
      <QuizModal />

      {/* Toast Notifications */}
      <Toast />
    </div>
  );
};

export function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}

export default App;
