import axios from 'axios';

const API_URL = 'http://localhost	:8080/api/savings';
const USER_SAVINGS_URL = 'http://localhost	:8080/api/savings/user';

const getToken = () => localStorage.getItem('jwtToken');

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 🔹 Add new Savings
export const addSavingsGoal = async (savingsData) => {
  const token = getToken();
  const response = await api.post('', savingsData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

// 🔹 Get All Savings (filtered by user)
export const getUserSavingsGoals = async () => {
  const token = getToken();
  const response = await axios.get(USER_SAVINGS_URL, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

// 🔹 Get Savings by ID
export const getSavingsGoalById = async (id) => {
  const token = getToken();
  const response = await api.get(`/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

// 🔹 Delete Savings by ID
export const deleteSavingsGoalById = async (id) => {
  const token = getToken();
  const response = await api.delete(`/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};
export const updateSavingsGoalById = async (id, updatedData) => {
  const token = localStorage.getItem('jwtToken');
  const response = await axios.put(`http://localhost	:8080/api/savings/${id}`, updatedData, {
   
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  });
  return response.data;
};