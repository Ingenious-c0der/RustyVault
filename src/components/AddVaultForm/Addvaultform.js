import React, { useState } from 'react';

const AddVaultForm = ({ onAddVault,toggleFunc}) => {
  var [iconPath, setIconPath] = useState('something');
  const [vaultName, setVaultName] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();

    const newVault = {
      iconPath,
      name: vaultName,
      data: password,
    };

    // Call the parent component's callback to add the new vault
    onAddVault(newVault);

    // Clear form fields after submission
    setIconPath('');
    setVaultName('');
    setPassword('');
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
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </label>
      <div>
        <button type="button" onClick={toggleFunc}>Cancel</button>
        <button type="submit">Add Vault</button>
      </div>
      
    </form>
  );
};

export default AddVaultForm;