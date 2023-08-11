import React from 'react';

function UserSidebar({ user }) {
  return (
    <div className="sidebar">
      <div className="user-details">
        <img src={user.profilePicture} alt="Profile" className="profile-picture" />
        <p className="user-name">{user.name}</p>
      </div>
      <button className="logout-button" onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
}

export default UserSidebar;