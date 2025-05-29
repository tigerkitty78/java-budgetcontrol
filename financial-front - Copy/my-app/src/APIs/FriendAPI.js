import axios from 'axios';

const API_URL = "http://localhost	:8080/api/friendships";

// Create an axios instance for reusable API calls
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Send a friend request
export const sendFriendRequest = async (recipientUsername) => {
  try {
    const token = localStorage.getItem('jwtToken');
    if (!token) throw new Error('No token found. Please log in.');

    const response = await api.post('/send', { recipientUsername }, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Accept a friend request
export const acceptFriendRequest = async (requestId) => {
  try {
    const token = localStorage.getItem('jwtToken');
    if (!token) throw new Error('No token found. Please log in.');

    const response = await api.post(`/accept/${requestId}`, {}, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Reject a friend request
export const rejectFriendRequest = async (requestId) => {
  try {
    const token = localStorage.getItem('jwtToken');
    if (!token) throw new Error('No token found. Please log in.');

    const response = await api.post(`/reject/${requestId}`, {}, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Get pending friend requests
export const getPendingRequests = async () => {
  try {
    const token = localStorage.getItem('jwtToken');
    if (!token) throw new Error('No token found. Please log in.');

    const response = await api.get('/pending', {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Get list of friends
export const getFriends = async () => {
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
