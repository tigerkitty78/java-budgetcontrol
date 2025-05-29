import axios from 'axios';

const API_URL = "http://localhost	:8080/api/saving";

// Create an axios instance for reusable API calls
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});



// Fetch all Savings
export const fetchSavings = async () => {
  try {
    const token = localStorage.getItem('jwtToken');
    if (!token) throw new Error('No token found. Please log in.');

    const response = await axios.get(`http://localhost	:8080/api/saving`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
  



export const addsaving = async (savingData) => {
    const token = localStorage.getItem('jwtToken');
    const response = await fetch('http://localhost	:8080/api/saving', {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(savingData)
    });
    if (!response.ok) throw new Error('Failed to add saving');
    return response.json();
};

export const getSavingById = async (id) => {
  const token = localStorage.getItem('jwtToken');
  const response = await fetch(`http://localhost	:8080/api/saving/${id}`, {
      method: 'GET',
      headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
      }
  });
  if (!response.ok) throw new Error('Failed to fetch saving');
  return response.json();
};


// Action to update an saving
export const updatesaving = async (savingId, savingData) => {
  const token = localStorage.getItem("jwtToken");
  const response = await api.put(`/${savingId}`, savingData, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

// Action to delete an saving
// Action to delete a saving
export const deletesaving = async (savingId) => {
  try {
    const token = localStorage.getItem('jwtToken'); // Retrieve JWT token from localStorage
    const response = await api.delete(
      `/${savingId}`,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // Include JWT token in Authorization header
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

