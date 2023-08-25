import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faCopy } from '@fortawesome/free-solid-svg-icons';
function VaultCard({ vault,vaultIcon, onCopyPassword, onRevealPassword }) {

  return (
    <div className="vault-card">
      <img src={vaultIcon} alt="Vault Icon" className="vault-icon" />
      <h3 className="vault-name">{vault.name}</h3>
      <div className = "interaction-buttons">
      <button className="copy-button" onClick={() => onCopyPassword(vault.vault_id)}>
        <FontAwesomeIcon icon={faCopy} className="button-icon" />
      </button>
      <button className="view-button" onClick={() => onRevealPassword(vault.vault_id)}>
        <FontAwesomeIcon icon={faEye} className="button-icon" />
      </button>
      </div>
    </div>
  );
}

export default VaultCard;