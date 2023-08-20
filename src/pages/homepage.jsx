import React from "react";
import { Card, Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { MdVisibility, MdContentPaste } from "react-icons/md";
import { invoke } from "@tauri-apps/api/tauri";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
class HomePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      vaults: [],
    };
  }
  testAllVaultFetch = async(event) => {
    try{
      event.preventDefault();
      const response = await invoke("get_all_user_vaults", {});
      console.log("response", response);
      if(!response.error){
        toast.success("Vaults Fetched Successfully");
      }else{
        toast.error(response.message);
      }
    }catch(error){
      toast.error("Vaults Fetch Failed");
    }
  }
  testEncryption = async(event) =>{
    try{
      event.preventDefault();
      console.log("test"); 
      const response = await invoke("create_vault", {
        vault:{
            name: "Gmail",
          data: "testpassword123",
          icon: "some_path"
        }
      });
      console.log("response", response);
      if(!response.error){
        toast.success("Encryption Successful");
      }else{
        toast.error(response.message);
      }
    }catch(error){
      toast.error("Encryption Failed");
    }
  }
  testDecryption = async(event)=>{
    event.preventDefault();
    console.log("testing decryption");
    const response = await invoke("get_password", {
    vaultId:  "8cb5f1a6-aadd-48c6-aa75-7e3047bf8fff"
  });
    console.log("response", response);
    if(!response.error){
      toast.success("Decryption Successful");
    }else{
      toast.error(response.message);
    }


  };


  render() {
    return (
      <div className="container">
        <Card
          style={{
            overflow: true,
            opacity: 0.9,
            backgroundColor: "",
            padding: "10px",
            width: "10rem",
            border: "solid 3px #540f00",
            borderRadius: "30px",
          }}
        >
          <Card.Img
            variant="top"
            style={{ backgroundColor:"Red",borderRadius: "10px" }}
            src="https://t3.ftcdn.net/jpg/03/86/50/54/240_F_386505487_omkU0kGEhMa3gQ83rVksoXX41AFFfi0K.jpg"
            width="80px"
          />
          <Card.Body>
            <row>
            <Button title ="Copy Password to Clipboard" style = {{marginRight: "16px"}} onClick= {this.testAllVaultFetch}>
              <MdContentPaste />
            </Button>
           
            <Button title ="Reveal Password">
              <MdVisibility />
            </Button>
            </row>
          </Card.Body>
        </Card>
        <Card
          style={{
            overflow: true,
            opacity: 0.9,
            backgroundColor: "",
            padding: "10px",
            width: "10rem",
            border: "solid 3px #540f00",
            borderRadius: "30px",
          }}
        >
          <Card.Img
            variant="top"
            style={{ backgroundColor:"Red",borderRadius: "10px" }}
            src="https://t3.ftcdn.net/jpg/03/86/50/54/240_F_386505487_omkU0kGEhMa3gQ83rVksoXX41AFFfi0K.jpg"
            width="80px"
          />
          <Card.Body>
            <row>
            <Button title ="Copy Password to Clipboard" style = {{marginRight: "16px"}} onClick= {this.testEncryption}>
              <MdContentPaste />
            </Button>
           
            <Button title ="Reveal Password" onClick= {this.testDecryption}>
              <MdVisibility />
            </Button>
            </row>
          </Card.Body>
        </Card>
      </div>
    );
  }
}
export default HomePage;
