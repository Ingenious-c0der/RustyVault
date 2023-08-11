import React from 'react';

function VaultCard({ vault, onCopyPassword, onViewPassword }) {
  return (
    <div className="vault-card">
      <img src={vault.iconPath} alt="Vault Icon" className="vault-icon" />
      <h3 className="vault-name">{vault.name}</h3>
      <button className="copy-button" onClick={() => onCopyPassword(vault.password)}>
        Copy Password
      </button>
      <button className="view-button" onClick={() => onViewPassword(vault.password)}>
        View Password
      </button>
    </div>
  );
}

export default VaultCard;