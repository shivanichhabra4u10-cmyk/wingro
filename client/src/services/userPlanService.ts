import axios from 'axios';

const API_URL = process.env.NODE_ENV === 'production'
  ? 'https://api.wingrox.com/api/user-plan'
  : 'http://localhost:3001/api/user-plan';

export const saveUserPlan = async (userId: string, planId: string, assessmentType: string) => {
  return axios.post(API_URL, { userId, planId, assessmentType });
};

export const getUserPlan = async (userId: string) => {
  return axios.get(`${API_URL}/${userId}`);
};
