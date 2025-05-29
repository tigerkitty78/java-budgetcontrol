// src/api/bills.js
import axios from "axios";




export const fetchBills = async () => {
  try {
    const token = localStorage.getItem('jwtToken');
    if (!token) throw new Error('No token found. Please log in.');

    const response = await axios.get("http://localhost	:8080/api/bills", {
      headers: { Authorization: `Bearer ${token}` },
    });

    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
