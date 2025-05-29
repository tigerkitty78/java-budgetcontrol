import axios from 'axios';

const API_URL = 'http://localhost	:8080/api/groups'; // Adjust based on your backend URL

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Create a new group
export const createGroup = async (groupData) => {
  try {
    const token = localStorage.getItem('jwtToken');
    if (!token) throw new Error('No token found. Please log in.');

    const response = await api.post('/create', groupData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Add users to a group
export const addUsersToGroup = async (groupId, userIds) => {
  try {
    const token = localStorage.getItem('jwtToken');
    if (!token) throw new Error('No token found. Please log in.');

    const response = await api.post(`/${groupId}/add-users`, userIds, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }

  
};
export const fetchUserGroups = async () => {
    try {
      const token = localStorage.getItem('jwtToken');
      if (!token) throw new Error('No token found. Please log in.');
  
      const response = await api.get('/groups', {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }}