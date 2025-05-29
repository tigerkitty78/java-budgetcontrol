import React, { useState } from 'react';
import '../App.css';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="sidebar-container">
      <button className="dropdown-toggle" onClick={toggleSidebar}>
        ☰ Menu
      </button>
      <div className={`sidebar ${isOpen ? 'active' : ''}`}>
        <a href="#">Home</a>
        <a href="#">About</a>
        <a href="#">Services</a>
        <a href="#">Contact</a>
      </div>
    </div>
  );
};

export default Sidebar;
