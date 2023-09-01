import React, { useState } from 'react';
import { ToastContainer, toast } from "react-toastify";
const DeleteVaultForm = ({ vault_id, vaultNameAct, onDeleteVault, toggleFunc }) => {

  const [vaultName, setVaultName] = useState('');
  var placeString = 'Enter ' + vaultNameAct + ' to Confirm';
  var [placeHolder, setPlaceHolder] = useState(placeString);
  const handleSubmit = (event) => {
    event.preventDefault();
    if (vaultName !== vaultNameAct) {
      //show toast 
      toast.warn("Vault name is not correct", { theme: "dark" });
      setVaultName('');
      return;
    }
    // Call the parent component's callback to delete the new vault
    onDeleteVault();
    // Clear form fields after submission
    setVaultName('');
    toggleFunc();
  };

  return (
    <form className="delete-vault-form" onSubmit={handleSubmit}>
      <label>
        Confirm Delete Vault {vaultNameAct} ?
        <input
          type="text"
          placeholder={placeHolder}
          value={vaultName}
          onChange={(e) => setVaultName(e.target.value)}

        />
      </label>
      <ToastContainer />
      <div>
        <button type="button" onClick={toggleFunc}>Cancel</button>
        <button type="submit">Delete Vault</button>
      </div>

    </form>
  );
};

export default DeleteVaultForm;