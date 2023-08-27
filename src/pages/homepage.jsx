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
class HomePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      vaults: [],
      showAddForm: false,
      searchQuery: '',
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
  createVault = async ( vault_json) => {
    try {
      console.log("creating vault")
      console.log(vault_json);
      const response = await invoke("create_vault", {vault :  vault_json });
      console.log("response", response);
      if (!response.error) {
        toast.success("Vault Created Successfully");
        this.setState({ showAddForm: false});
        this.fetchAllVaults();
      } else {
        toast.error(`Something Went Wrong ${response.message}`);
      }
    } catch (error) {
      toast.error("Vault Creation Failed");
    }
  };
  fetchAllVaults = async (event) => {
    try {
      console.log("fetching vaults");
      const response = await invoke("get_all_user_vaults", {});
      console.log("response", response);
      if (!response.error) {
        toast.success("Vaults Fetched Successfully");
        console.log("response", response);
        this.setState({ vaults: response.vaults });
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error("Vaults Fetch Failed");
    }
  };

  revealPassword = async (vault_id) => {
    console.log("testing decryption");
    const response = await invoke("get_password", {
      vaultId: vault_id,
    });
    console.log("response", response);
    if (!response.error) {
      toast.success("Decryption Successful");
    } else {
      toast.error(response.message);
    }
  };

  render() {
    const { vaults,showAddForm,searchQuery } = this.state;
    const filteredVaults = vaults.filter((vault) =>
      vault.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    console.log("vaults", vaults);
    return (
      <div className="container">
        <div className="search-bar">
          <FontAwesomeIcon icon={faSearch} className="search-icon" />
          <input
            type="text"
            placeholder="Search vaults..."
            value={searchQuery}
            onChange={this.handleSearchChange}
          />
        </div>
        <div className="homepage-container">
         
        <button className="plus-button" onClick={this.toggleAddForm}>
          <FontAwesomeIcon icon={faPlus} />
        </button>
        {showAddForm && (
          <div className="overlay">
            <AddVaultForm 
            onAddVault={this.createVault}
            toggleFunc={this.toggleAddForm}/>
          </div>
        )}
        <div className="vault-cards">
          {filteredVaults.map(
            (vault) => (
              console.log("vault", vault),
              (
                <VaultCard
                  vault={vault}
                  onCopyPassword={() => {}}
                  onRevealPassword={() => this.revealPassword(vault.vault_id)}
                />
              )
            )
          )}
        </div>
        </div>
      </div>
    );
  }
}
export default HomePage;
