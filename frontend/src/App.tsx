import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { ErrorBoundary } from './components/ErrorBoundary';
import { MenuPage } from './pages/MenuPage';
import { CategoryPage } from './pages/CategoryPage';
import { Toaster } from './components/ui/toaster';
import { GlobalStateProvider, useGlobalState } from './contexts/GlobalStateContext';
import { LoadingOverlay } from './components/LoadingOverlay';
import { setupAxiosInterceptors } from './services/axiosInterceptor';
import { WebSocketInterceptor } from './services/wsInterceptor';
import './App.css';

function AppContent() {
  const { dispatch } = useGlobalState();

  useEffect(() => {
    setupAxiosInterceptors(dispatch);
    WebSocketInterceptor.getInstance().setDispatch(dispatch);
  }, [dispatch]);

  return (
    <BrowserRouter>
      <ErrorBoundary>
        <Layout>
          <LoadingOverlay />
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/categories" element={<CategoryPage />} />
            <Route path="/menuItems" element={<MenuPage />} />
          </Routes>
        </Layout>
        <Toaster />
      </ErrorBoundary>
    </BrowserRouter>
  );
}

export default function App() {
  return (
    <GlobalStateProvider>
      <AppContent />
    </GlobalStateProvider>
  );
}
