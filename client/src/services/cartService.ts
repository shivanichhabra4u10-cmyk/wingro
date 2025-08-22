import axios from 'axios';
import { CartItem } from '../context/CartContext';

const API_URL = 'http://localhost:3001/api/cart';

function getAuthConfig() {
  const token = localStorage.getItem('token');
  return token ? { headers: { Authorization: `Bearer ${token}` } } : {};
}

export const fetchCart = async () => {
  const res = await axios.get(API_URL, getAuthConfig());
  return res.data.cart;
};

export const saveCart = async (cart: CartItem[]) => {
  const res = await axios.post(API_URL, { cart }, getAuthConfig());
  return res.data.cart;
};

export const clearCart = async () => {
  const res = await axios.post(`${API_URL}/clear`, {}, getAuthConfig());
  return res.data.cart;
};
