import axios from 'axios';

const API_URL = `${process.env.REACT_APP_API_URL}/api/assessment/organization`;

export const submitOrganizationAssessment = async (data: any) => {
  const response = await axios.post(API_URL, data);
  return response.data;
};
