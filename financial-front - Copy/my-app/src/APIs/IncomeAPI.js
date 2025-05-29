import axios from 'axios';

const API_URL = "http://localhost	:8080/api/income";

// Create an axios instance for reusable API calls
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Fetch all incomes
export const fetchIncomes = async () => {
  try {
    const token = localStorage.getItem('jwtToken');
    if (!token) throw new Error('No token found. Please log in.');

    const response = await axios.get('http://localhost	:8080/api/showincome', {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Action to add an income
export const addIncome = async (incomeData) => {
  const token = localStorage.getItem('jwtToken');
  const response = await fetch('http://localhost	:8080/api/addincome', {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(incomeData)
  });
  if (!response.ok) throw new Error('Failed to add income');
  return response.json();
};

// Action to fetch a single income by ID
export const getIncomeById = async (incomeId) => {
  try {
    const token = localStorage.getItem('jwtToken');
    if (!token) throw new Error('No token found. Please log in.');

    const response = await api.get(`/${incomeId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};


// Action to update an income
export const updateIncome = async (incomeId, incomeData) => {
  try {
    const response = await api.put(`/${incomeId}`, incomeData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Action to delete an income
export const deleteIncome = async (incomeId) => {
  try {
    const response = await api.delete(`/${incomeId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
