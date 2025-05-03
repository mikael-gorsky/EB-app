// src/App.tsx
import React, { useEffect, useState } from 'react';
import { HashRouter, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import theme from './styles/theme';
import { supabase } from './utils/supabaseClient';

import LandingPage from './pages/LandingPage';
import ReflectPage111 from './pages/ReflectPage111';
import GrowPage from './pages/GrowPage';
import HistoryPage from './pages/HistoryPage';
import AnalysisDetailPage from './pages/AnalysisDetailPage';
import GrowModuleDetailPage from './pages/GrowModuleDetailPage';
import UserPage from './pages/UserPage';
import SettingsPage from './pages/SettingsPage';
import PremiumPage from './pages/PremiumPage';
import AboutPage from './pages/AboutPage';
import Auth from './components/auth/Auth';
import AppLayout from './layouts/AppLayout';

// Create a context to store authentication state
export const AuthContext = React.createContext<{
  user: any | null;
  loading: boolean;
}>({
  user: null,
  loading: true
});

// Auth provider component
const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check current auth state
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      setUser(data.session?.user || null);
      setLoading(false);
    };
    
    checkAuth();
    
    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user || null);
      }
    );
    
    return () => subscription.unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// Protected route component
const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, loading } = React.useContext(AuthContext);
  
  // If it's a route that doesn't need protection, render it
  const publicRoutes = ['/', '/auth', '/reflect111', '/grow', '/about', '/premium'];
  const isPublicRoute = publicRoutes.some(route => location.pathname.startsWith(route));
  
  useEffect(() => {
    if (!loading && !user && !isPublicRoute) {
      // Store the attempted path for later redirect
      sessionStorage.setItem('redirectAfterAuth', location.pathname);
      navigate('/auth');
    }
  }, [user, loading, isPublicRoute, location.pathname, navigate]);
  
  if (loading) return <div>Loading...</div>;
  
  if (!user && !isPublicRoute) return null; // Will redirect in the useEffect
  
  return children;
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <HashRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/auth" element={<Auth />} />
            
            <Route path="/reflect111" element={
              <AppLayout>
                <ReflectPage111 />
              </AppLayout>
            } />
            
            <Route path="/grow/*" element={
              <AppLayout>
                <GrowPage />
              </AppLayout>
            } />
            
            <Route path="/grow/:moduleId" element={
              <AppLayout>
                <GrowModuleDetailPage />
              </AppLayout>
            } />
            
            <Route path="/history" element={
              <ProtectedRoute>
                <AppLayout>
                  <HistoryPage />
                </AppLayout>
              </ProtectedRoute>
            } />
            
            <Route path="/analysis/:id" element={
              <ProtectedRoute>
                <AppLayout>
                  <AnalysisDetailPage />
                </AppLayout>
              </ProtectedRoute>
            } />
            
            <Route path="/user" element={
              <ProtectedRoute>
                <AppLayout>
                  <UserPage />
                </AppLayout>
              </ProtectedRoute>
            } />
            
            <Route path="/settings/*" element={
              <ProtectedRoute>
                <AppLayout>
                  <SettingsPage />
                </AppLayout>
              </ProtectedRoute>
            } />
            
            <Route path="/premium" element={
              <AppLayout>
                <PremiumPage />
              </AppLayout>
            } />
            
            <Route path="/about" element={
              <AppLayout>
                <AboutPage />
              </AppLayout>
            } />
          </Routes>
        </AuthProvider>
      </HashRouter>
    </ThemeProvider>
  );
}

export default App;