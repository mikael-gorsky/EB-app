// src/App.tsx
import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import theme from './styles/theme';

import LandingPage from './pages/LandingPage';
import ReflectPage111 from './pages/ReflectPage111';
import GrowPage from './pages/GrowPage';
import HistoryPage from './pages/HistoryPage';
import AnalysisDetailPage from './pages/AnalysisDetailPage';
import GrowModuleDetailPage from './pages/GrowModuleDetailPage';
import Auth from './components/auth/Auth';
import AppLayout from './layouts/AppLayout';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <HashRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/auth" element={<Auth />} />
          
          <Route path="/reflect111" element={
            <AppLayout>
              <ReflectPage111 />
            </AppLayout>
          } />
          
          <Route path="/grow" element={
            <AppLayout>
              <GrowPage />
            </AppLayout>
          } />
          
          <Route path="/history" element={
            <AppLayout>
              <HistoryPage />
            </AppLayout>
          } />
          
          <Route path="/analysis/:id" element={
            <AppLayout>
              <AnalysisDetailPage />
            </AppLayout>
          } />
          
          <Route path="/grow/:moduleId" element={
            <AppLayout>
              <GrowModuleDetailPage />
            </AppLayout>
          } />
        </Routes>
      </HashRouter>
    </ThemeProvider>
  );
}

export default App;