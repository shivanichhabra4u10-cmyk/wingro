import React from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';

const CartButton: React.FC = () => {
  const { cart } = useCart();
  const navigate = useNavigate();

  return (
    <button
      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center gap-2"
      onClick={() => navigate('/cart')}
      title="View Cart"
    >
      🛒 Cart
      {cart.items.length > 0 && (
        <span className="ml-2 bg-red-500 text-white rounded-full px-2 text-xs">{cart.items.length}</span>
      )}
    </button>
  );
};

export default CartButton;
