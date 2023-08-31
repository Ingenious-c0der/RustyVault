import React from "react";
import { Card, Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { MdVisibility, MdContentPaste } from "react-icons/md";
import { invoke } from "@tauri-apps/api/tauri";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import VaultCard from "../components/VaultCard/VaultCard";
import Sidebar from "../components/Sidebar/Sidebar.js";
import AddVaultForm from "../components/AddVaultForm/Addvaultform";
import DeleteVaultForm from "../components/DeleteVaultForm/Deletevaultform";
import EditVaultForm from "../components/EditVaultForm/Editvaultform";
import { faPlus, faSearch } from "@fortawesome/free-solid-svg-icons";
import clipboardCopy from "clipboard-copy";
import emptyVaultImage from "../components/VaultCard/vault_images/vault-4.png";
import Image from "next/image";

class HomePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      vaults: [],
      username: "",
      showAddForm: false,
      showDeleteForm: false,
      showEditForm: false,
      searchQuery: "",
      selectedVaultName: "",
      selectedVaultId: "",
    };
  }
  componentDidMount() {
    this.fetchAllVaults();
  }
  handleSearchChange = (event) => {
    this.setState({
      searchQuery: event.target.value,
    });
  };
  toggleAddForm = () => {
    this.setState((prevState) => ({
      showAddForm: !prevState.showAddForm,
    }));
  };

  toggleEditForm = (vault_id, vault_name) => {
    console.log("toggle edit form filling")
    console.log(vault_id)
    console.log(vault_name)
    this.setState((prevState) => ({
      showEditForm: !prevState.showEditForm,
      selectedVaultId: vault_id,
      selectedVaultName: vault_name,
    }));
  };
    toggleEditFormClose = () => {
    console.log("toggle edit form empty")
    this.setState((prevState) => ({
      showEditForm: !prevState.showEditForm,
      selectedVaultId: "",
      selectedVaultName: "",
    }));
  };

  toggleDeleteForm = (vault_id, vault_name) => {
    this.setState((prevState) => ({
      showDeleteForm: !prevState.showDeleteForm,
      selectedVaultId: vault_id,
      selectedVaultName: vault_name,
    }));
  };
    toggleDeleteFormClose = () => {
    this.setState((prevState) => ({
      showDeleteForm: !prevState.showDeleteForm,
      selectedVaultId: "",
      selectedVaultName:"",
    }));
  };


  deleteVault = async (vault_id) => {
    try {
      console.log("deleting vault");
      const response = await invoke("delete_vault", { vaultId: vault_id });
      console.log("response", response);
      if (!response.error) {
        toast.success("Vault Deleted Successfully", { theme: "dark" });
        this.fetchAllVaults();
      } else {
        toast.error(response.message, { theme: "dark" });
      }
    } catch (error) {
      toast.error("Vault Deletion Failed", { theme: "dark" });
    }
  };

  editVault = async (vault_json) => {
    try {
      console.log("editing vault");
      console.log(vault_json);
      for (const vault of this.state.vaults) {
        if (vault.name === vault_json.name && vault.vault_id !== vault_json.vault_id) {
          toast.error("Vault with this name already exists", { theme: "dark" });
          return;
        }
      }
      const response = await invoke("edit_vault", {
        vault: vault_json,
      });
      console.log("response", response);
      if (!response.error) {
        toast.success("Vault Edited Successfully", { theme: "dark" });
        this.fetchAllVaults();
      } else {
        toast.error(response.message, { theme: "dark" });
      }
    } catch (error) {
      toast.error("Vault Edit Failed", { theme: "dark" });
    }
  };
  createVault = async (vault_json) => {
    try {
      console.log("creating vault");
      console.log(vault_json);
      //check if the given vault name already exists
      for (const vault of this.state.vaults) {
        if (vault.name === vault_json.name) {
          toast.error("Vault with this name already exists", { theme: "dark" });
          return;
        }
      }
      const response = await invoke("create_vault", { vault: vault_json });
      console.log("response", response);
      if (!response.error) {
        toast.success("Vault Created Successfully", { theme: "dark" });
        this.setState({ showAddForm: false });
        this.fetchAllVaults();
      } else {
        toast.error(`Something Went Wrong ${response.message}`, {
          theme: "dark",
        });
      }
    } catch (error) {
      toast.error("Vault Creation Failed", { theme: "dark" });
    }
  };
  fetchAllVaults = async (event) => {
    try {
      console.log("fetching vaults");
      const response = await invoke("get_all_user_vaults", {});
      const user_response = await invoke("get_username", {});
     
      if (!response.error && !user_response.error) {
        toast.success("Vaults Fetched Successfully", { theme: "dark" });
        this.setState({
          vaults: response.vaults,
          username: user_response.username,
        });
      } else {
        toast.error(response.message, { theme: "dark" });
      }
    } catch (error) {
      toast.error("Vaults Fetch Failed", { theme: "dark" });
    }
  };
  copyPassToClipboard = async (vault_id) => {
    console.log("testing copy to clip");
    const response = await invoke("get_password", {
      vaultId: vault_id,
    });
    console.log("response", response);

    if (response) {
      clipboardCopy(response);
      toast.success("Password Copied to clipboard", { theme: "dark" });
    } else {
      toast.error("Could not copy Pass to clipboard", { theme: "dark" });
    }
  };

  logout = async (event) => {
    console.log("logging out");
    // const response = await invoke("logout", {});
    // console.log("response", response);
    // if (!response.error) {
    //doesn't need a logout function as of now in rust backend
    toast.success("Logout Successful", { theme: "dark" });
    window.location.href = "/";
    //   } else {
    //     toast.error(response.message);
    //   }
    // } catch (error) {
    //   toast.error("Logout Failed");
    // }
  };

  revealPassword = async (vault_id) => {
    console.log("testing decryption");
    const response = await invoke("get_password", {
      vaultId: vault_id,
    });
    console.log("response", response);

    if (!response.error) {
      toast.success("Decryption Successful", { theme: "dark" });
      return response;
    } else {
      toast.error(response.message, { theme: "dark" });
      return "Error Decrypting!";
    }
  };

  render() {
    const { vaults, showAddForm, showDeleteForm, showEditForm, searchQuery } =
      this.state;
    const filteredVaults = vaults.filter((vault) =>
      vault.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    return (
      <div className="container">
        <Sidebar onLogout={this.logout} username={this.state.username} />
        <div className="homepage-container">
          <div className="search-bar">
            <FontAwesomeIcon icon={faSearch} className="search-icon" />
            <input
              type="text"
              placeholder="Search vaults..."
              value={searchQuery}
              onChange={this.handleSearchChange}
            />
          </div>
          <button className="plus-button" onClick={this.toggleAddForm}>
            <FontAwesomeIcon icon={faPlus} />
          </button>
          {showAddForm && (
            <div className="overlay">
              <AddVaultForm
                onAddVault={this.createVault}
                toggleFunc={this.toggleAddForm}
              />
            </div>
          )}
          {showDeleteForm && (
            <div className="overlay">
              <DeleteVaultForm
                onDeleteVault={() => this.deleteVault(this.state.selectedVaultId)}
                toggleFunc={() => {this.toggleDeleteFormClose()}}
                vaultNameAct = {this.state.selectedVaultName}
                vaultId = {this.state.selectedVaultId}
              />
            </div>
          )}
          {showEditForm && (
            <div className="overlay">
              <EditVaultForm
                onEditVault={this.editVault}
                toggleFunc={() => {this.toggleEditFormClose()}}
                vaultNameAct = {this.state.selectedVaultName}
                vault_id = {this.state.selectedVaultId}

              />
            </div>
          )}
          <div className="vault-cards">
            {vaults.length === 0 ? (
              <div className="empty-vaults-message">
                <Image
                  src={emptyVaultImage}
                  alt="Empty Vaults"
                  className="empty-vaults-image"
                />
                <p>
                  It's quite lonely here :(, click on the plus button in the
                  bottom right to add your first vault!
                </p>
              </div>
            ) : (
              filteredVaults.map((vault) => (
                <VaultCard
                  key={vault.vault_id}
                  vault={vault}
                  onCopyPassword={() =>
                    this.copyPassToClipboard(vault.vault_id)
                  }
                  onRevealPassword={() => this.revealPassword(vault.vault_id)}
                  toggleDeleteVault={() =>
                    this.toggleDeleteForm(vault.vault_id, vault.name)
                  }
                  toggleEditVault={() =>
                    this.toggleEditForm(vault.vault_id, vault.name)
                  }
                />
              ))
            )}
          </div>
        </div>
        <ToastContainer />
      </div>
    );
  }
}
export default HomePage;
