import React from 'react';
import { Calculator } from 'lucide-react';
import { Toaster } from 'sonner';
import { ProjectProvider } from './context/ProjectContext';
import { NavigationProvider } from './context/NavigationContext';
import Navigation from './components/navigation/Navigation';
import MainContent from './components/layout/MainContent';

function App() {
  return (
    <NavigationProvider>
      <ProjectProvider>
        <div className="min-h-screen bg-slate-50 flex">
          <Navigation />
          <div className="flex-1">
            <header className="bg-white shadow-sm">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                <div className="flex items-center space-x-3">
                  <Calculator className="h-8 w-8 text-indigo-600" />
                  <h1 className="text-2xl font-semibold text-gray-900">DNMD 예산관리 시스템</h1>
                </div>
              </div>
            </header>
            <MainContent />
          </div>
        </div>
        <Toaster position="top-right" expand={true} richColors />
      </ProjectProvider>
    </NavigationProvider>
  );
}

export default App;