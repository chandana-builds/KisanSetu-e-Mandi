import React, { useState } from 'react';
import { MandiProvider, useMandi } from './context/MandiContext';
import { Navbar } from './components/Navbar';
import { HomePage } from './components/Home/HomePage';
import { AuthModal } from './components/Auth/AuthModal';
import { FarmerPortal } from './components/Farmer/FarmerPortal';
import { AdminDashboard } from './components/Admin/AdminDashboard';
import { YardDisplayBoard } from './components/YardDisplay/YardDisplayBoard';
import { SmsSimulatorModal } from './components/Farmer/SmsSimulatorModal';

function MainApp() {
  const { currentUser } = useMandi();
  
  // Default to landing Home page
  const [currentView, setCurrentView] = useState('home'); // 'home' | 'farmer' | 'admin' | 'yardDisplay'
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authInitialRole, setAuthInitialRole] = useState('farmer');
  const [isSmsOpen, setIsSmsOpen] = useState(false);

  const handleOpenAuth = (role = 'farmer') => {
    setAuthInitialRole(role);
    setIsAuthOpen(true);
  };

  const handleLoginSuccess = (user) => {
    setIsAuthOpen(false);
    if (user.role === 'officer') {
      setCurrentView('admin');
    } else {
      setCurrentView('farmer');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans">
      
      {/* Top Navigation */}
      <Navbar 
        currentView={currentView} 
        setCurrentView={setCurrentView} 
        onOpenSms={() => setIsSmsOpen(true)}
        onOpenAuth={handleOpenAuth}
      />

      {/* Main Page Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {currentView === 'home' && (
          <HomePage 
            onOpenAuth={handleOpenAuth}
            onOpenYardDisplay={() => setCurrentView('yardDisplay')}
          />
        )}

        {currentView === 'farmer' && (
          currentUser ? (
            <FarmerPortal />
          ) : (
            <div className="py-8">
              <AuthModal 
                isOpen={true}
                initialRole="farmer"
                onClose={() => setCurrentView('home')}
                onLoginSuccess={handleLoginSuccess}
              />
            </div>
          )
        )}

        {currentView === 'admin' && (
          currentUser?.role === 'officer' ? (
            <AdminDashboard />
          ) : (
            <div className="py-8">
              <AuthModal 
                isOpen={true}
                initialRole="officer"
                onClose={() => setCurrentView('home')}
                onLoginSuccess={handleLoginSuccess}
              />
            </div>
          )
        )}

        {currentView === 'yardDisplay' && (
          <YardDisplayBoard />
        )}
      </main>

      {/* Auth Modal (when opened from navbar or buttons) */}
      <AuthModal 
        isOpen={isAuthOpen}
        initialRole={authInitialRole}
        onClose={() => setIsAuthOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />

      {/* Real-time SMS Simulator */}
      <SmsSimulatorModal 
        isOpen={isSmsOpen} 
        onClose={() => setIsSmsOpen(false)} 
      />

      {/* Official Government Agriculture Footer */}
      <footer className="bg-white border-t border-slate-200 py-8 text-xs text-slate-500 mt-16 print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <span className="font-bold text-slate-900 text-sm font-display">KisanSetu (कृषि सेतु)</span>
            <p className="text-slate-500 mt-0.5">
              National Digital Agriculture Procurement, Anti-Congestion & Direct Benefit Transfer Platform.
            </p>
          </div>
          <div className="flex items-center gap-4 text-slate-500">
            <span>English • हिन्दी • తెలుగు</span>
            <span>•</span>
            <span className="text-emerald-700 font-semibold">Government of India Compliant</span>
          </div>
        </div>
      </footer>

    </div>
  );
}

export default function App() {
  return (
    <MandiProvider>
      <MainApp />
    </MandiProvider>
  );
}
