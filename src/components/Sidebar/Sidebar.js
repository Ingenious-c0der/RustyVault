// Sidebar.js
import React from 'react';

import Image from "next/image";
import profilePic from "./sidebar_images/profile_pic.png";
const Sidebar = ({ username = "Not Found", onLogout }) => {
  let profileIconPath = "./images/vault-some_path.png";
  const generateRandomEncryptedText = () => {
    // Your encryption logic here
    // This is a simple example, and you may want to use a proper encryption library
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()';
    const textLength = 68; // Increased the length for a more visible example
    let encryptedText = '';
  
    for (let i = 0; i < textLength; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      const randomColor = generateRandomColor(); // Function to generate random color
  
      encryptedText += `<span style="color: ${randomColor};">${characters.charAt(randomIndex)}</span>`;
  
      // Add a new line after every 10 characters
      if ((i + 1) % 17 === 0 && i !== textLength - 1) {
        encryptedText += '<br>';
      }
    }
  
    return { __html: encryptedText }; // Use dangerouslySetInnerHTML to render HTML
  };
  
  const generateRandomColor = () => {
    const colors = ['#FFA500', '#FF8C00', '#FF7F50', '#FF6347', '#8B4513'];
    const randomIndex = Math.floor(Math.random() * colors.length);
    return colors[randomIndex];
  };
  
  const EncryptedVault = () => {
    const encryptedText = generateRandomEncryptedText();
    const vaultStyle = {
      backgroundColor: '#1f1a1a',
      color: '#fff',
      padding: '16px',
      borderRadius: '8px',
      border: '1px solid #570404',
      position: 'relative',
      overflow: 'hidden',
    };

  
    return (
      <div style={vaultStyle}>
     
        <div dangerouslySetInnerHTML={encryptedText} />
      </div>
    );
  };
  
  return (
    <div className="sidebar">
      
      <ul className="sidebar-menu">
        <li className="sidebar-menu-item username">{username}</li>
        {/* <li className="default-profile-icon-sidebar-menu-item">
          <Image
            src={profilePic} // Adjust the path if needed
            alt="Profile Icon"
            className="profile-icon"
          />
        </li> */}
         <EncryptedVault/>
         <EncryptedVault/>
        
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