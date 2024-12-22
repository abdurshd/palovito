import { BrowserRouter } from 'react-router-dom';
import { Routes, Route } from 'react-router-dom';
import { MenuPage } from './pages/MenuPage';
import { Cart } from './components/cart/Cart';
import { Checkout } from './pages/Checkout';
import { OrderStatus } from './pages/OrderStatus';
import { OrderHistory } from './pages/OrderHistory';
import { Home } from './pages/Home';
import { Layout } from './components/layout/Layout';
import { Toaster } from './components/ui/toaster';
import { CartProvider } from './contexts/CartProvider';

export default function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/menu" element={<MenuPage />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/orders/:orderId" element={<OrderStatus />} />
            <Route path="/orders" element={<OrderHistory />} />
          </Routes>
        </Layout>
        <Toaster />
      </CartProvider>
    </BrowserRouter>
  );
}
