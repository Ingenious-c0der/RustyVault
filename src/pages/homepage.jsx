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
import { faPlus, faSearch } from "@fortawesome/free-solid-svg-icons";
import clipboardCopy from "clipboard-copy";
import emptyVaultImage from "../components/VaultCard/vault_images/vault-4.png";
import Image from "next/image";
class HomePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      vaults: [],
      username : '',
      showAddForm: false,
      searchQuery: "",
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
  createVault = async (vault_json) => {
    try {
      console.log("creating vault");
      console.log(vault_json);
      const response = await invoke("create_vault", { vault: vault_json });
      console.log("response", response);
      if (!response.error) {
        toast.success("Vault Created Successfully",{ theme: "dark" });
        this.setState({ showAddForm: false });
        this.fetchAllVaults();
      } else {
        toast.error(`Something Went Wrong ${response.message}`, { theme: "dark" });
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
      console.log("response", response);
      if (!response.error && !user_response.error) {
        toast.success("Vaults Fetched Successfully", { theme: "dark" });
        console.log("response", response);
        this.setState({ vaults: response.vaults, username: user_response.username });

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
    const { vaults, showAddForm, searchQuery } = this.state;
    const filteredVaults = vaults.filter((vault) =>
      vault.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    console.log("vaults", vaults);
    return (
      <div className="container">
        <Sidebar 
        onLogout={this.logout}
        username={this.state.username}
        />  
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
          <div className="vault-cards">
          {vaults.length === 0 ? (
          <div className="empty-vaults-message">
            <Image src={emptyVaultImage} alt="Empty Vaults" className="empty-vaults-image" />
            <p>It's lonely here, click on the plus button in the bottom right to add your first vault!</p>
          </div>
        ) : (
          filteredVaults.map((vault) => (
            <VaultCard
              key={vault.vault_id} 
              vault={vault}
              onCopyPassword={() => this.copyPassToClipboard(vault.vault_id)}
              onRevealPassword={() => this.revealPassword(vault.vault_id)}
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
