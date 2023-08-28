// Sidebar.js
import React from 'react'; 

import Image from "next/image";
import profilePic from "./sidebar_images/profile_pic.png";
const Sidebar = ({ username = "Not Found", onLogout }) => {
  let profileIconPath = "./images/vault-some_path.png";
 
  return (
    <div className="sidebar">
      <ul className="sidebar-menu">
        <li className="sidebar-menu-item username">{username}</li>
        <li className="default-profile-icon-sidebar-menu-item">
        <Image
            src={profilePic} // Adjust the path if needed
            alt="Profile Icon"
            className="profile-icon"
          />
        </li>
      </ul>
      <div className="logout-container">
        <button className="logout-button" onClick={onLogout}>
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;