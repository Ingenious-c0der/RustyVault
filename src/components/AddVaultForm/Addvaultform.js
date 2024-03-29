import React, { useState } from 'react';
import { ToastContainer, toast } from "react-toastify";
const AddVaultForm = ({ onAddVault, toggleFunc }) => {
  var [iconPath, setIconPath] = useState('something');
  const [vaultName, setVaultName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passlength, setPassLength] = useState(15);
  const handleSubmit = (event) => {
    event.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      //show toast 
      toast.warn("Passwords do not match", { theme: "dark" });
      setPassword('');
      setConfirmPassword('');
      return;
    }
    console.log(passlength)
    const newVault = {
      iconPath,
      name: vaultName,
      data: password,
      pass_length : passlength,
    };

    // Call the parent component's callback to add the new vault
    onAddVault(newVault);

    // Clear form fields after submission
    setIconPath('');
    setVaultName('');
    setPassword('');
    setConfirmPassword('');
    setPassLength(15);
  };

  return (
    <form className="add-vault-form" onSubmit={handleSubmit}>
      <label>
        Vault Name
        <input
          type="text"
          value={vaultName}
          onChange={(e) => setVaultName(e.target.value)}
          required
        />
      </label>
      <label>
        Password
        <input
          type="password"
          placeholder="leave this blank to auto generate"
          value={password}
          onChange={(e) => setPassword(e.target.value)}

        />
      </label>
      <label>
        Confirm Password
        <input
          type="password"
          placeholder="leave this blank to auto generate"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}

        />
      </label>
      <label>
        Password Length (only if auto generating)
        <input type="number" id="numericInput" name="numericInput" pattern="[0-9]*" inputMode="numeric"
          value={passlength}
          onChange={(e) => setPassLength(e.target.value)}
        />
      </label>
      <ToastContainer />
      <div>
        <button type="button" onClick={toggleFunc}>Cancel</button>
        <button type="submit">Add Vault</button>
      </div>

    </form>
  );
};

export default AddVaultForm;