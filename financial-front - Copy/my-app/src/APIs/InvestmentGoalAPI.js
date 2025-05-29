import axios from 'axios';

// Fetch all Investment Goals
export const fetchInvestmentGoals = async () => {
  const GOAL_API_URL = "http://localhost	:8080/api/investment-goals";
  try {
    const token = localStorage.getItem('jwtToken');
    if (!token) throw new Error('No token found. Please log in.');

    const response = await axios.get(GOAL_API_URL, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
      ,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Add a new Investment Goal
export const addInvestmentGoal = async (goalData) => {
  const GOAL_API_URL = 'http://localhost	:8080/api/investment-goals';
  const token = localStorage.getItem('jwtToken');
  const response = await axios.post(GOAL_API_URL, goalData, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
    ,
  });
  if (!response.ok) throw new Error('Failed to add investment goal');
  return response.data;
};

// Get Investment Goal by ID
export const getInvestmentGoalById = async (id) => {
  const GOAL_API_URL = "http://localhost	:8080/api/investment-goals";
  const token = localStorage.getItem('jwtToken');
  const response = await axios.get(`${GOAL_API_URL}/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) throw new Error('Failed to fetch investment goal');
  return response.data;
};

// Update an Investment Goal
export const updateInvestmentGoal = async (goalId, goalData) => {
  const GOAL_API_URL = "http://localhost	:8080/api/investment-goals";
  try {
    const response = await axios.put(`${GOAL_API_URL}/${goalId}`, goalData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Delete an Investment Goal



export const deleteInvestmentGoal = async (goalId) => {
  const GOAL_API_URL = "http://localhost	:8080/api/investment-goals";
const token = localStorage.getItem('jwtToken');
  try {
    const response = await axios.delete(`${GOAL_API_URL}/${goalId}`, {
      
      headers: {
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true // Optional, based on server config
    });
    return response.data;
  } catch (error) {
    console.error('Delete error:', error.response?.data || error.message);
    throw error;
  }
};

// Add a contribution to an investment goal
export const addContributionToGoal = async (goalId, amount) => {
  const CONTRIBUTION_API_URL = `http://localhost	:8080/api/investment-goals/${goalId}/contribute`;
  const token = localStorage.getItem('jwtToken');

  try {
    const response = await axios.post(
      CONTRIBUTION_API_URL,
      { amount },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
