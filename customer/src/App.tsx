import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { Home } from './pages/Home';
import { MenuPage } from './pages/MenuPage';
import { Checkout } from './pages/Checkout';
import { OrderStatus } from './pages/OrderStatus';
import { OrderHistory } from './pages/OrderHistory';
import { CartProvider } from './contexts/CartProvider';
import { Toaster } from './components/ui/toaster';

export default function App() {
  return (
    <Router>
      <CartProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/menu" element={<MenuPage />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/order-status/:orderId" element={<OrderStatus />} />
            <Route path="/orders" element={<OrderHistory />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Layout>
        <Toaster />
      </CartProvider>
    </Router>
  );
}
