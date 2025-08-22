import axios from 'axios';

const API_URL = process.env.NODE_ENV === 'production'
  ? 'https://api.wingrox.com/api/assessment/organization'
  : 'http://localhost:3001/api/assessment/organization';

export const submitOrganizationAssessment = async (data: any) => {
  const response = await axios.post(API_URL, data);
  return response.data;
};
