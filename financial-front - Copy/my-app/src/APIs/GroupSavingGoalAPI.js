import axios from 'axios';

const API_URL = 'http://localhost	:8080/api/group-savings-goals';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const createGoal = async (goalData) => {
  const token = localStorage.getItem('jwtToken');
  if (!token) throw new Error('No token found. Please log in.');
  const response = await api.post('/create', goalData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const fetchGoals = async () => {
  const token = localStorage.getItem('jwtToken');
  if (!token) throw new Error('No token found. Please log in.');
  const response = await api.get('/', {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const updateGoal = async (goalId, updatedGoal) => {
  const token = localStorage.getItem('jwtToken');
  if (!token) throw new Error('No token found. Please log in.');
  const response = await api.put(`/update/${goalId}`, updatedGoal, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const deleteGoal = async (goalId) => {
  const token = localStorage.getItem('jwtToken');
  if (!token) throw new Error('No token found. Please log in.');
  const response = await api.delete(`/delete/${goalId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const fetchGoalsByGroup = async (groupId) => {
  const token = localStorage.getItem('jwtToken');
  if (!token) throw new Error('No token found. Please log in.');
  const response = await api.get(`/group/${groupId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const fetchGoalsWithContributions = async (groupId) => {
  const response = await api.get(`/${groupId}/details`);
  return response.data;
};
