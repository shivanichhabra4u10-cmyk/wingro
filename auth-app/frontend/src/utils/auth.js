import axios from 'axios';

export async function refreshToken() {
  try {
    const res = await axios.post('http://localhost:5000/api/auth/refresh-token', {}, { withCredentials: true });
    return res.data.user;
  } catch {
    return null;
  }
}

export async function getAdminContent() {
  try {
    const res = await axios.get('http://localhost:5000/api/auth/admin', { withCredentials: true });
    return res.data;
  } catch {
    return null;
  }
}
