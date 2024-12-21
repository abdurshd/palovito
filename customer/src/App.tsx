import { Routes, Route } from 'react-router-dom';
import { MenuPage } from './pages/MenuPage';
import { Cart } from './components/cart/Cart';
import { Checkout } from './pages/Checkout';
import { OrderStatus } from './pages/OrderStatus';
import { OrderHistory } from './pages/OrderHistory';

export function App() {
  return (
    <Routes>
      <Route path="/" element={<MenuPage />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/checkout" element={<Checkout />} />
      <Route path="/orders/:orderId" element={<OrderStatus />} />
      <Route path="/orders" element={<OrderHistory />} />
    </Routes>
  );
}
