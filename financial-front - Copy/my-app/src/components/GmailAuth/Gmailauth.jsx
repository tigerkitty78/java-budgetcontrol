import React from 'react';

// Use a link or button to navigate directly
const GoogleAuthButton = () => {
  const handleAuth = () => {
    const token = localStorage.getItem('jwtToken');
    // Directly navigate to your backend's OAuth endpoint
    window.location.href = `http://localhost	:8080/gmail/authorize`;
  };

  return <button onClick={handleAuth}>Login with Google</button>;
};

export default GoogleAuthButton;
