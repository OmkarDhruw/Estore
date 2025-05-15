import React from 'react';
import { X, ShoppingCart, Trash2, ChevronRight } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { Link } from 'react-router-dom';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose }) => {
  const {
    items,
    removeItem,
    updateQuantity,
    totalPrice,
    totalItems,
    clearCart,
  } = useCart();

  return (
    <div className={`fixed inset-0 z-50 ${isOpen ? 'visible' : 'invisible'}`}>
      {/* Backdrop */}
      <div 
        className={`absolute inset-0 bg-black transition-opacity duration-300 ${isOpen ? 'opacity-50' : 'opacity-0'}`} 
        onClick={onClose}
      ></div>
      
      {/* Cart Sidebar */}
      <div 
        className={`absolute top-0 right-0 h-full w-full sm:w-96 bg-white shadow-xl transition-transform duration-300 ease-in-out transform ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        {/* Cart Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center">
            <ShoppingCart className="mr-2 text-indigo-600" />
            <h2 className="text-xl font-semibold">Your Cart</h2>
            <span className="ml-2 text-sm bg-gray-200 rounded-full px-2 py-0.5">{totalItems}</span>
          </div>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100">
            <X size={20} />
          </button>
        </div>
        
        {/* Cart Body */}
        <div className="flex flex-col h-[calc(100%-173px)] overflow-y-auto">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full p-4 text-center">
              <ShoppingCart size={48} className="text-gray-300 mb-2" />
              <p className="text-lg text-gray-500 mb-4">Your cart is empty</p>
              <button 
                onClick={onClose} 
                className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <div className="p-4 space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex border-b pb-4">
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    className="w-20 h-20 object-cover rounded-md mr-3"
                  />
                  <div className="flex-1">
                    <h3 className="font-medium">{item.name}</h3>
                    <p className="text-sm text-gray-500">Model: {item.deviceModel}</p>
                    <div className="flex items-center mt-1">
                      <span className="text-gray-900 font-medium">₹{item.price.toLocaleString()}</span>
                    </div>
                    
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center border rounded-md">
                        <button 
                          onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                          className="px-2 py-1 border-r hover:bg-gray-100"
                        >
                          -
                        </button>
                        <span className="px-2 py-1">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="px-2 py-1 border-l hover:bg-gray-100"
                        >
                          +
                        </button>
                      </div>
                      <button 
                        onClick={() => removeItem(item.id)}
                        className="text-gray-400 hover:text-red-500"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Cart Footer */}
        {items.length > 0 && (
          <div className="border-t p-4 bg-gray-50 absolute bottom-0 w-full">
            <div className="flex justify-between mb-4">
              <span className="font-medium">Subtotal</span>
              <span className="font-semibold">₹{totalPrice.toLocaleString()}</span>
            </div>
            <p className="text-sm text-gray-500 mb-4">Shipping and taxes calculated at checkout</p>
            <Link
              to="/checkout"
              onClick={onClose}
              className="w-full bg-indigo-600 text-white py-3 px-4 rounded-md flex items-center justify-center hover:bg-indigo-700 transition-colors"
            >
              Checkout <ChevronRight size={16} className="ml-1" />
            </Link>
            <button 
              onClick={clearCart}
              className="w-full text-gray-600 py-2 mt-2 hover:text-gray-900 transition-colors"
            >
              Clear Cart
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartDrawer; 