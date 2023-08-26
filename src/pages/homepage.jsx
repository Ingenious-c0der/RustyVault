import React from "react";
import { Card, Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { MdVisibility, MdContentPaste } from "react-icons/md";
import { invoke } from "@tauri-apps/api/tauri";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import VaultCard from "../components/VaultCard/VaultCard";
import SideBar from "../components/SideBar/SideBar";

class HomePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      vaults: [],
    };
  }
   componentDidMount() {
     this.fetchAllVaults();
  }
  createVault = async(event,vault_json) =>{
    try{
      event.preventDefault();
      const response = await invoke("create_vault", {vault_json});
      console.log("response", response);
      if(!response.error){
        toast.success("Vault Created Successfully");
      }else{
        toast.error(`Something Went Wrong ${response.message}`);
      }

    }catch(error){
      toast.error("Vault Creation Failed");
    }
  }
  fetchAllVaults = async(event) => {
    try{
      console.log("fetching vaults")
      const response = await invoke("get_all_user_vaults",{});
      console.log("response", response);
      if(!response.error){
        toast.success("Vaults Fetched Successfully");
        console.log("response", response)
        this.setState({vaults: response.vaults});
      }else{
        toast.error(response.message);
      }
    }catch(error){
      toast.error("Vaults Fetch Failed");
    }
  }

  revealPassword = async(vault_id)=>{
    console.log("testing decryption");
    const response = await invoke("get_password", {
    vaultId:  vault_id
  });
    console.log("response", response);
    if(!response.error){
      toast.success("Decryption Successful");
    }else{
      toast.error(response.message);
    }
  };


  render() {
    const {vaults} = this.state;
    console.log("vaults", vaults)
    return (
      <div className="container">
        <div className="vault-cards">
          {vaults.map(vault => (
            console.log("vault", vault),
            <VaultCard
              vault = {vault}
              onCopyPassword={() => {}}
              onRevealPassword={() => this.revealPassword(vault.vault_id)}
            />
         
          ))}
        </div>
      </div>
    );
  }
}
export default HomePage;
