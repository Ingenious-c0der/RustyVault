// Sidebar.js
import React from 'react'; 

const Sidebar = () => {
  return (
    <div className="sidebar">
      <ul className="sidebar-menu">
        <li className="sidebar-menu-item">Dashboard</li>
        <li className="sidebar-menu-item">Vaults</li>
        {/* Add more menu items as needed */}
      </ul>
    </div>
  );
};

export default Sidebar;