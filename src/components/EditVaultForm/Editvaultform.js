import React, { useState } from 'react';
import { ToastContainer, toast } from "react-toastify";
const EditVaultForm = ({ vault_id, vaultNameAct,onEditVault, toggleFunc }) => {

  const [vaultName, setVaultName] = useState(vaultNameAct);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  console.log(vaultNameAct);
  const handleSubmit = (event) => {
    event.preventDefault();
    if(password !== confirmPassword){
      alert("Passwords do not match");
      //show toast 
      toast.warn("Passwords do not match", { theme: "dark" });
      setPassword('');
      setConfirmPassword('');
      return;
    }

    const newVault = {
      vault_id: vault_id,
      name: vaultName,
      data: password,
    };

    // Call the parent component's callback to add the new vault
    onEditVault(newVault);

    // Clear form fields after submission
    setVaultName(vaultNameAct);
    setPassword('');
    setConfirmPassword('');
    toggleFunc();
  };

  return (
    <form className="edit-vault-form" onSubmit={handleSubmit}>
      <label>
        Edit Vault Name
        <input
          type="text"
          value={vaultName}
          onChange={(e) => setVaultName(e.target.value)}
          required
        />
      </label>
      <label>
        New Password
        <input
          type="password"
          placeholder="leave this blank to auto generate"
          value={password}
          onChange={(e) => setPassword(e.target.value)}

        />
      </label>
      <label>
        Confirm New Password
        <input
          type="password"
          placeholder="leave this blank to auto generate"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}

        />
      </label>
      <ToastContainer />
      <div>
        <button type="button" onClick={toggleFunc}>Cancel</button>
        <button type="submit">Edit Vault</button>
      </div>

    </form>
  );
};

export default EditVaultForm;