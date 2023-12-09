import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faCopy, faCog } from '@fortawesome/free-solid-svg-icons';

import Image from "next/image";
function VaultCard({ vault, onCopyPassword, onRevealPassword, toggleEditVault, toggleDeleteVault }) {
  var [isPasswordShown, setPasswordShown] = useState(false);
  var [password, setPassword] = useState('Default');
  const [showDropdown, setShowDropdown] = useState(false);
  const handleViewPassword = async () => {

    var x = await onRevealPassword(vault.vault_id);
    //console.log(x);
    setPassword(x);
    setPasswordShown(true);
    setTimeout(() => {
      setPasswordShown(false);
    }, 15000); // Hide after 15 seconds
  };
  //console.log(vault);
  const iconNum = vault.icon_path;
  const vaultLogo = require(`./vault_images/vault-${iconNum}.png`);
  const handleToggleDropdown = (event) => {
    event.stopPropagation();
    setShowDropdown(!showDropdown); // Toggle the dropdown state
  };
  const closeDropdown = () => {
    setShowDropdown(false);
  };
  return (

    <div  onClick={closeDropdown} className={`vault-card ${isPasswordShown ? 'flipped' : ''}`   }>
      <Image src={vaultLogo} alt="Vault Logo" className="vault-logo" />
      <h3 className="vault-name-tooltip" data-text={vault.name}>
        {vault.name.length > 9 ? `${vault.name.slice(0, 9)}...` : vault.name}
      </h3>
      <div className="interaction-buttons">
        <button className="copy-button" onClick={() => onCopyPassword(vault.vault_id)}>
          <FontAwesomeIcon icon={faCopy} className="button-icon" />
          <span className="label-name">Copy</span>
        </button>
        <button className="view-button" onClick={handleViewPassword}>
          <FontAwesomeIcon icon={faEye} className="button-icon" />
          <span className="label-name">View</span>
        </button>
        <div className="settings-dropdown">
          <button className="settings-button" onClick={handleToggleDropdown}>
            <FontAwesomeIcon icon={faCog} className="button-icon" />
            <span className="label-name">Settings</span>
          </button>
          {showDropdown && (
            <div className="dropdown-options">
              <button onClick={toggleEditVault}>Edit Vault</button>
              <button onClick={toggleDeleteVault}>Delete Vault</button>
            </div>
          )}
        </div>
        {isPasswordShown && (
          <div className="password-overlay">
            <p className="password">{password}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default VaultCard;