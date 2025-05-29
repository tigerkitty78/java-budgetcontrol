import React from 'react';

export default function PremiumContent() {
  const user = JSON.parse(localStorage.getItem('user'));

  if (!user?.premium) {
    return <p>This is a premium feature. Please upgrade.</p>;
  }

  return (
    <div>
      <h2>Premium Content</h2>
      <p>Welcome to the premium section!</p>
    </div>
  );
}
