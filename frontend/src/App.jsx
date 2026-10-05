import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { Assessment } from './pages/Assessment';
import { Result } from './pages/Result';
import { Tips } from './pages/Tips';
import { History } from './pages/History';
import { About } from './pages/About';
import { HowItWorks } from './pages/HowItWorks';
import { checkApiHealth } from './services/api';

function AppContent({ latestResult, latestFormData, handleSaveResult }) {
  const location = useLocation();
  const path = location.pathname;

  // The 4 reference screens have no footer to match the design specifications
  const showFooter = path === '/about' || path === '/how-it-works';

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-[#F2F8FF] via-[#EAF3FD] to-[#E3EFFC] text-[#10244A] font-sans antialiased selection:bg-blue-100 selection:text-blue-900">
      
      {/* Top Header / Navbar */}
      <Navbar />

      {/* Dynamic Route Pages */}
      <main className="flex-1 w-full flex flex-col justify-start">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route 
            path="/assessment" 
            element={<Assessment onSaveResult={handleSaveResult} />} 
          />
          <Route 
            path="/result" 
            element={
              <Result 
                savedResult={latestResult} 
                savedFormData={latestFormData} 
              />
            } 
          />
          <Route path="/history" element={<History />} />
          <Route path="/tips" element={<Tips />} />
          <Route path="/about" element={<About />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>


      {/* Footer only on supplementary information pages */}
      {showFooter && <Footer />}

    </div>
  );
}

export default function App() {
  const [latestResult, setLatestResult] = useState(null);
  const [latestFormData, setLatestFormData] = useState(null);

  useEffect(() => {
    // Proactively verify backend server availability
    checkApiHealth();
  }, []);

  const handleSaveResult = (result, formData) => {
    setLatestResult(result);
    setLatestFormData(formData);
  };

  return (
    <Router>
      <AppContent 
        latestResult={latestResult}
        latestFormData={latestFormData}
        handleSaveResult={handleSaveResult}
      />
    </Router>
  );
}
