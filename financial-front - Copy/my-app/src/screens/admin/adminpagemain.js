import React, { useEffect, useState } from 'react';
import API from '../api';

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    API.get('/admin/users').then(res => {
      setUsers(res.data);
    });
  }, []);

  if (user?.role !== 'ADMIN') return <p>Access denied</p>;

  return (
    <div>
      <h2>Admin Panel</h2>
      <ul>
        {users.map(u => (
          <li key={u.id}>{u.username} - {u.premium ? 'Premium' : 'Free'}</li>
        ))}
      </ul>
    </div>
  );
}
