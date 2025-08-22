import React, { useState } from 'react';
import { useCart } from '../context/CartContext';

const Cart: React.FC = () => {
  const { cart, removeFromCart, updateQuantity, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCheckout = async () => {
    setLoading(true);
    setError(null);
    try {
      const checkoutItems = cart.items.map(({ productId, quantity }) => ({ productId, quantity }));
      const res = await fetch('http://localhost:3001/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: checkoutItems }),
      });
      const session = await res.json();
      if (session.free && session.downloadUrl) {
        window.location.href = session.downloadUrl;
        await clearCart();
        return;
      }
      if (session.id) {
        const stripeModule = await import('@stripe/stripe-js');
        const stripe = await stripeModule.loadStripe('pk_test_51RiIvuHIOERYAOnI6YsstgEaBYWoF6LJkat0sJI3LHPN3cdsXBhgAcTtF3HMe7R7pAliSkNoDCyOrv1jPUvD0q0h0073rs3DjP');
        await stripe?.redirectToCheckout({ sessionId: session.id });
        await clearCart();
      } else {
        setError('Failed to start payment.');
      }
    } catch (err: any) {
      setError(err.message || 'Checkout failed.');
    } finally {
      setLoading(false);
    }
  };

  if (cart.items.length === 0) {
    return (
      <div className="p-12 text-center text-gray-400 text-2xl font-semibold bg-white rounded-2xl mt-10 shadow-md">
        Your cart is empty.
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto mt-12 bg-white rounded-3xl shadow-xl p-8 md:p-12 min-h-[340px]">
      <h2 className="text-3xl md:text-4xl font-extrabold mb-8 text-center text-indigo-900 tracking-tight drop-shadow">Your Cart</h2>
      <ul className="divide-y divide-gray-200 mb-8">
        {cart.items.map(item => (
          <li key={item.productId} className="flex flex-col md:flex-row items-center gap-4 py-5">
            {item.image && (
              <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-xl shadow-sm border border-gray-100" />
            )}
            <div className="flex-1 w-full flex flex-col md:flex-row md:items-center gap-2 md:gap-0">
              <div className="flex-1">
                <div className="font-bold text-lg text-indigo-700 mb-1 hover:underline cursor-pointer">{item.name}</div>
                <div className="text-gray-500 text-base font-medium">₹{item.price}</div>
              </div>
              <div className="flex items-center gap-2 mt-2 md:mt-0">
                <input
                  type="number"
                  min={1}
                  value={item.quantity}
                  onChange={e => updateQuantity(item.productId, Math.max(1, Number(e.target.value)))}
                  className="w-14 border border-gray-300 rounded-lg px-2 py-1 font-semibold text-base text-center bg-gray-50 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                />
                <button
                  onClick={() => removeFromCart(item.productId)}
                  className="ml-2 text-pink-600 font-bold text-base hover:underline hover:text-pink-700 transition-colors"
                >
                  Remove
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div></div>
        <div className="text-xl md:text-2xl font-extrabold text-indigo-900 text-right">Total: ₹{cart.items.reduce((sum, i) => sum + i.price * i.quantity, 0)}</div>
      </div>
      {error && <div className="text-red-500 mb-4 text-center font-semibold">{error}</div>}
      <div className="flex flex-col md:flex-row justify-center gap-6">
        <button
          onClick={handleCheckout}
          className="bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-500 hover:to-blue-600 text-white font-extrabold rounded-xl px-10 py-4 text-lg shadow-lg transition-all duration-150 disabled:opacity-60 disabled:cursor-not-allowed"
          disabled={loading}
        >
          {loading ? 'Processing...' : 'Checkout'}
        </button>
        <button
          onClick={clearCart}
          className="bg-gray-100 hover:bg-gray-200 text-indigo-900 font-bold rounded-xl px-10 py-4 text-lg shadow-md transition-all duration-150"
        >
          Clear Cart
        </button>
      </div>
    </div>
  );
};

export default Cart;
