import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faCopy } from '@fortawesome/free-solid-svg-icons';
import vaultLogo from "./vault_images/vault_icon.png";
import Image from "next/image";
function VaultCard({ vault,onCopyPassword, onRevealPassword }) {

  return (
    <div className="vault-card">
      <Image src={vaultLogo} alt="Vault Logo" width={80} height={80} />
      <h3 className="vault-name">{vault.name}</h3>
      <div className = "interaction-buttons">
      <button className="copy-button" onClick={() => onCopyPassword(vault.vault_id)}>
        <FontAwesomeIcon icon={faCopy} className="button-icon" />
      </button>
      <button className="view-button" title="View Password" onClick={() => onRevealPassword(vault.vault_id)}>
        <FontAwesomeIcon icon={faEye} className="button-icon" />
      </button>
      </div>
    </div>
  );
}

export default VaultCard;