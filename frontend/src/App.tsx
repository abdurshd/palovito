import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
// import { OrderForm } from './pages/OrderForm'
import { ErrorBoundary } from './components/ErrorBoundary'
import { MenuPage } from './pages/MenuPage'
import { CategoryPage } from './pages/CategoryPage'
import './App.css'
import { Toaster } from './components/ui/toaster';

export default function App() {
  return (
    <BrowserRouter>
        <ErrorBoundary>
          <Layout>
            <Routes>
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="/dashboard" element={<Dashboard />} />
                {/* <Route path="/order" element={<OrderForm />} /> */}
                <Route path="/categories" element={<CategoryPage />} />
                <Route path="/menuItems" element={<MenuPage />} />
            </Routes>
          </Layout>
          <Toaster />
        </ErrorBoundary>
    </BrowserRouter>
  );
}
