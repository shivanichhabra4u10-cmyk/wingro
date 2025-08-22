import React, { useState } from 'react';
import { useCart } from '../context/CartContext';

const CartCheckoutButton: React.FC = () => {
  const { cart, clearCart } = useCart();
  const [showSuccess, setShowSuccess] = useState(false);

  const handleCheckout = async () => {
    // Simulate checkout logic (replace with real API call if needed)
    await clearCart();
    setShowSuccess(true);
  };

  return (
    <>
      {!showSuccess ? (
        <button
          className="w-full mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          onClick={handleCheckout}
          disabled={cart.items.length === 0}
        >
          Buy Now
        </button>
      ) : (
        <div className="w-full mt-4 bg-white border border-green-400 rounded p-6 text-center">
          <h2 className="text-2xl font-bold text-green-700 mb-2">Payment Successful!</h2>
          <p className="mb-4 text-green-600">Thank you for your purchase. Your cart has been cleared.</p>
          <div className="mt-4">
            <h3 className="text-lg font-semibold mb-2">Download Links:</h3>
            <ul className="space-y-2">
              {/* Replace these with actual download links for purchased products */}
              {cart.items.map((item) => (
                <li key={item.productId}>
                  <a
                    href={`/downloads/${item.productId}`}
                    className="text-cyan-700 underline hover:text-cyan-900"
                    download
                  >
                    Download {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </>
  );
};

export default CartCheckoutButton;
