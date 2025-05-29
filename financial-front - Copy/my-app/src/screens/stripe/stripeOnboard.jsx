import React, { useState } from 'react';
import axios from 'axios';

const StripeOnboardingForm = () => {
  const [message, setMessage] = useState('');

  const handleOnboard = async () => {
    try {
      // Make sure you use the correct key — adjust if yours is different
      const token = localStorage.getItem('jwtToken'); 

      if (!token) {
        setMessage("User not logged in. JWT token missing.");
        return;
      }

      const response = await axios.post('http://localhost	:8080/api/onboard', {}, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      setMessage(response.data);
    } catch (error) {
      console.error("Error:", error);
      setMessage(error.response?.data || "Something went wrong");
    }
  };

  return (
    <div>
      <h2>Stripe Onboarding</h2>
      <button onClick={handleOnboard}>Onboard to Stripe</button>
      <p>{message}</p>
    </div>
  );
};

export default StripeOnboardingForm;
