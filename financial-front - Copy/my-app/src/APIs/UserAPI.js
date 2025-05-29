import axios from 'axios';
const API_URL = "http://localhost	:8080/api";

// Create an axios instance for reusable API calls
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// const API_BASE_URL = 'http://localhost	:8080'; // Adjust to match your backend server
// Add/register a new user
export const postUser = async (userData) => {
  const response = await api.post('/user', userData);
  return response.data;
};

// Get all users
export const getAllUsers = async () => {
  const response = await api.get('/users');
  return response.data;
};




// Get current logged-in user by token
export const getCurrentUser = async () => {
    const token = localStorage.getItem('jwtToken');
  const response = await api.get('/user', {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

// Get a user by ID
export const getUserById = async (id) => {
  const response = await api.get(`/user/${id}`);
  return response.data;
};

// Login user
export const loginUser = async (loginDTO) => {
  const response = await api.post('/login', loginDTO);
  return response.data;
};

// Onboard user to Stripe
export const onboardUserToStripe = async (token) => {
  const response = await api.post('/onboard', null, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};