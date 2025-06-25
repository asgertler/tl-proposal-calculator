import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AppHeader from './components/AppHeader';
import ProposalCalculator from './components/ProposalCalculator';
import ProjectManager from './components/ProjectManager';
import ResetPassword from './components/ResetPassword';
import NotFound from './components/NotFound';
import ExperimentalLayout from './components/ExperimentalLayout';
import TestLayout from './components/TestLayout';
import { ProposalProvider } from './context/ProposalContext';
import { ThemeProvider } from './context/ThemeContext';

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <div className="min-h-screen bg-light-bg dark:bg-space-black text-light-text-primary dark:text-white">
                <ProposalProvider>
                  <AppHeader />
                  <main className="container mx-auto px-4 py-8">
                    <div className="grid grid-cols-1 gap-6">
                      <ProjectManager />
                      <ProposalCalculator />
                    </div>
                  </main>
                  <ToastContainer 
                    position="bottom-right"
                    theme="dark"
                    toastClassName="bg-space-gray-900 text-white"
                  />
                </ProposalProvider>
              </div>
            }
          />
          <Route
            path="/experimental"
            element={
              <div className="min-h-screen bg-light-bg dark:bg-space-black">
                <ProposalProvider>
                  <AppHeader />
                  <TestLayout />
                  <ToastContainer 
                    position="bottom-right"
                    theme="dark"
                    toastClassName="bg-space-gray-900 text-white"
                  />
                </ProposalProvider>
              </div>
            }
          />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;