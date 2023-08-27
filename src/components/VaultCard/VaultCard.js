import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faCopy, faCog } from '@fortawesome/free-solid-svg-icons';
import vaultLogo from "./vault_images/vault_icon.png";
import Image from "next/image";
function VaultCard({ vault,onCopyPassword, onRevealPassword }) {

  return (
    <div className="vault-card">
      <Image src={vaultLogo} alt="Vault Logo" className="vault-logo" />
      <h3 className="vault-name">{vault.name}</h3>
      <div className = "interaction-buttons">
      <button className="copy-button" onClick={() => onCopyPassword(vault.vault_id)}>
        <FontAwesomeIcon icon={faCopy} className="button-icon" />
        <span className="label-name">Copy</span>
      </button>
      <button className="view-button" onClick={() => onRevealPassword(vault.vault_id)}>
        <FontAwesomeIcon icon={faEye} className="button-icon" />
        <span className="label-name">View</span>
      </button>
      <button className="settings-button" onClick={() => onRevealPassword(vault.vault_id)}>
        <FontAwesomeIcon icon={faCog} className="button-icon" />
        <span className="label-name">Settings</span>
      </button>
      </div>
    </div>
  );
}

export default VaultCard;