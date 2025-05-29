import axios from 'axios';

const API_URL = "http://localhost	:8080/api/investments";

// Create an axios instance for reusable API calls
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Fetch all Investments
export const fetchInvestments = async () => {
  try {
    const token = localStorage.getItem('jwtToken');
    if (!token) throw new Error('No token found. Please log in.');

    const response = await api.get('', {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Add a new Investment
export const addInvestment = async (investmentData) => {
  const token = localStorage.getItem('jwtToken');
  const response = await api.post('', investmentData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) throw new Error('Failed to add investment');
  return response.data;
};

// Get Investment by ID
export const getInvestmentById = async (id) => {
  const token = localStorage.getItem('jwtToken');
  const response = await api.get(`/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) throw new Error('Failed to fetch investment');
  return response.data;
};

// Update an Investment
export const updateInvestment = async (investmentId, investmentData) => {
  try {
      const token = localStorage.getItem('jwtToken');
    const response = await api.put(`/${investmentId}`, investmentData,{ headers: {
        Authorization: `Bearer ${token}`,
      },});
    
    return response.data;
    
  } catch (error) {
    throw error;
  }
};

// Delete an Investment
export const deleteInvestment = async (investmentId) => {
  try {
     const token = localStorage.getItem('jwtToken');
    const response = await api.delete(`/${investmentId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
