import axios from 'axios';

const API_URL = "http://localhost	:8080/api/expense";

// Create an axios instance for reusable API calls
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});



// Fetch all expenses
export const fetchExpenses = async () => {
  try {
    const token = localStorage.getItem('jwtToken');
    if (!token) throw new Error('No token found. Please log in.');

    const response = await axios.get(`http://localhost	:8080/api/expenses`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
 


// Fetch all expenses
export const fetchExpensesByID = async (id) => {
  try {
    const token = localStorage.getItem('jwtToken');
    if (!token) throw new Error('No token found. Please log in.');

    const response = await axios.get(`http://localhost	:8080/api/expense/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

  

// Action to add an expense
export const fetchCategories = async () => {
    
    try {
        const token = localStorage.getItem('jwtToken');
        if (!token) throw new Error('No token found. Please log in.');
    
        const response = await axios.get('http://localhost	:8080/api/categories', {
          headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
      } catch (error) {
        throw error.response?.data || error.message;
      }
};


export const addExpense = async (expenseData) => {
    const token = localStorage.getItem('jwtToken');
    const response = await fetch('http://localhost	:8080/api/expense', {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(expenseData)
    });
    if (!response.ok) throw new Error('Failed to add expense');
    return response.json();
};

// Action to update an expense
export const updateExpense = async (id, expenseData) => {
  const token = localStorage.getItem('jwtToken');
  
  try {
    const response = await api.put(
      `http://localhost	:8080/api/expense/${id}`, 
      expenseData, 
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` // Include token in headers
        }
      }
    );
    
    return response.data;
  } catch (error) {
    console.error("Error updating expense:", error);
    throw error;
  }
};


// Action to delete an expense
export const deleteExpense = async (expenseId) => {
  try {
    const token = localStorage.getItem('jwtToken');

    const response = await api.delete(`/${expenseId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};


// Fetch forecast data
export const fetchForecastData = async () => {
  try {
    const token = localStorage.getItem('jwtToken');
    const response = await axios.get('http://localhost	:8080/api/forecast', {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
