import { useState } from 'react';
import { useCart } from '../../hooks/useCart';
import { Button } from '../ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '../ui/sheet';
import { ShoppingCart, Minus, Plus, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function Cart() {
  const { items, removeFromCart, updateQuantity, total } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleCheckout = () => {
    setIsOpen(false);
    navigate('/checkout');
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <ShoppingCart size={20} />
          {items.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {items.length}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>Your Cart</SheetTitle>
        </SheetHeader>
        <div className="mt-8 space-y-4">
          {items.length === 0 ? (
            <p className="text-center text-gray-500">Your cart is empty</p>
          ) : (
            <>
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.menuItem.id} className="flex items-center gap-4 py-4 border-b">
                    <img
                      src={item.menuItem.imageUrl}
                      alt={item.menuItem.name}
                      className="w-20 h-20 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold">{item.menuItem.name}</h3>
                      <p className="text-sm text-gray-500">
                        ${item.menuItem.price} x {item.quantity}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateQuantity(item.menuItem.id, Math.max(1, item.quantity - 1))}
                        >
                          <Minus size={14} />
                        </Button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateQuantity(item.menuItem.id, item.quantity + 1)}
                        >
                          <Plus size={14} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-500 ml-2"
                          onClick={() => removeFromCart(item.menuItem.id)}
                        >
                          <Trash2 size={14} />
                        </Button>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">
                        ${(item.menuItem.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="border-t pt-4">
                <div className="flex justify-between mb-4">
                  <span className="font-semibold">Total</span>
                  <span className="font-semibold">${total.toFixed(2)}</span>
                </div>
                <Button className="w-full" onClick={handleCheckout}>
                  Proceed to Checkout
                </Button>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
} 