// SavingsGoalAPI.js
import axios from 'axios';

const API_URL = "http://localhost	:8080/api/savings";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add new Savings
export const addSavingsGoal = async (savingsData) => {
  const token = localStorage.getItem('jwtToken');
  const response = await api.post( savingsData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

// Get Savings by ID
export const getSavingsGoalById = async (id) => {
  const token = localStorage.getItem('jwtToken');
  const response = await api.get(`/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};


// 🔹 Update Savings by ID

