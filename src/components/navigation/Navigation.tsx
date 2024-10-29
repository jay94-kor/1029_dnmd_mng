import React from 'react';
import { 
  LayoutDashboard, 
  FileText, 
  Calculator, 
  Receipt, 
  PieChart, 
  Settings,
  Users
} from 'lucide-react';
import { useNavigation } from '../../context/NavigationContext';

const menuItems = [
  { id: 'dashboard', icon: LayoutDashboard, label: '대시보드' },
  { id: 'projects', icon: FileText, label: '프로젝트 관리' },
  { id: 'budget', icon: Calculator, label: '예산 관리' },
  { id: 'po', icon: Receipt, label: 'PO 관리' },
  { id: 'reports', icon: PieChart, label: '리포트' },
  { id: 'users', icon: Users, label: '사용자 관리' },
  { id: 'settings', icon: Settings, label: '설정' },
];

function Navigation() {
  const { currentPage, setCurrentPage } = useNavigation();

  return (
    <div className="w-64 bg-white border-r border-gray-200 min-h-screen">
      <div className="p-4">
        <div className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentPage(item.id)}
                className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                  currentPage === item.id
                    ? 'bg-indigo-50 text-indigo-600'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Icon className="mr-3 h-5 w-5" />
                {item.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Navigation;