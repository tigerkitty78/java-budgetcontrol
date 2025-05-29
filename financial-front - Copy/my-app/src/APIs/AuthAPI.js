import axios from "axios";

const BASE_URL = "http://localhost	:8080/auth";

export const loginUser = async (userData) => {
  try {
    const response = await axios.post(`${BASE_URL}/login`, userData);
    
    // Verify response structure
    if (!response.data || typeof response.data !== 'object') {
      throw new Error('Invalid server response format - expected object');
    }
    
    // Extract token from nested structure
    const token = response.data.jwtToken; // Access jwtToken property
    
    if (!token || typeof token !== 'string') {
      throw new Error('Token not found in response');
    }
    
    // Store token in localStorage
    localStorage.setItem('jwtToken', token);
    
    // Set default authorization header for axios
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    
    console.log('Login successful. Token stored:', token.substring(0, 10) + '...');
    
    return { 
      success: true, 
      token: token,
      user: response.data.user // Add if your backend returns user details
    };

  } catch (error) {
    let errorMessage = 'Login failed';
    
    // Enhanced error handling
    if (error.response) {
      errorMessage = error.response.data?.message || 
                    error.response.data?.error ||
                    `Server error: ${error.response.status} ${error.response.statusText}`;
    } else if (error.request) {
      errorMessage = 'No response from server - check network connection';
    } else {
      errorMessage = error.message;
    }
    
    console.error('Login error:', errorMessage);
    
    // Clear invalid token
    localStorage.removeItem('jwtToken');
    delete axios.defaults.headers.common['Authorization'];
    
    return { 
      success: false, 
      error: errorMessage,
      details: error.response?.data || null
    };
  }
};

export const signUpUser = async (userData) => {
  try {
    const token = localStorage.getItem("jwtToken"); // Required since /signup needs token
    const response = await axios.post(`${BASE_URL}/signup`, userData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data; // returns success message
  } catch (error) {
    console.error("Signup Error:", error);
    throw error.response ? error.response.data : new Error("Signup failed");
  }
};