import React from 'react';
import { loadStripe } from '@stripe/stripe-js';

// TODO: Replace with your Stripe test publishable key
const stripePromise = loadStripe('pk_test_51RiIvuHIOERYAOnI6YsstgEaBYWoF6LJkat0sJI3LHPN3cdsXBhgAcTtF3HMe7R7pAliSkNoDCyOrv1jPUvD0q0h0073rs3DjP');

interface BuyNowButtonProps {
  productId: string | number;
  children?: React.ReactNode;
}

const BuyNowButton: React.FC<BuyNowButtonProps> = ({ productId, children }) => {
  const handleBuyNow = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const stripe = await stripePromise;
    // Call backend to create a Stripe Checkout session
    const res = await fetch('http://localhost:3001/api/create-checkout-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId }),
    });
    const session = await res.json();
    if (session.free && session.downloadUrl) {
      // Free product: skip payment, go to download
      window.location.href = session.downloadUrl;
      return;
    }
    if (session.id) {
      await stripe?.redirectToCheckout({ sessionId: session.id });
    } else {
      alert('Failed to start payment.');
    }
  };
  return (
    <button
      style={{
        marginTop: 16,
        padding: '10px 0',
        background: 'linear-gradient(90deg, #6366f1 0%, #a21caf 100%)',
        color: '#fff',
        border: 'none',
        borderRadius: 8,
        fontWeight: 700,
        fontSize: 15,
        cursor: 'pointer',
        boxShadow: '0 2px 8px 0 rgba(80,80,120,0.10)',
        width: '100%'
      }}
      onClick={handleBuyNow}
    >
      {children || 'Buy Now'}
    </button>
  );
};

export default BuyNowButton;
