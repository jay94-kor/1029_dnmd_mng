import React from 'react';
import { useNavigation } from '../../context/NavigationContext';
import ProjectForm from '../ProjectForm';
import POManagement from '../po/POManagement';
import Dashboard from '../dashboard/Dashboard';
import Reports from '../reports/Reports';
import Users from '../users/Users';
import Settings from '../settings/Settings';
import BudgetManagement from '../budget/BudgetManagement';

function MainContent() {
  const { currentPage } = useNavigation();

  const renderContent = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'projects':
        return <ProjectForm />;
      case 'budget':
        return <BudgetManagement />;
      case 'po':
        return <POManagement />;
      case 'reports':
        return <Reports />;
      case 'users':
        return <Users />;
      case 'settings':
        return <Settings />;
      default:
        return <div className="p-8">페이지 준비 중입니다.</div>;
    }
  };

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-8">
          {renderContent()}
        </div>
      </div>
    </main>
  );
}

export default MainContent;