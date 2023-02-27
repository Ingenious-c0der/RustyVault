import React, { useState } from "react";
import { invoke } from "@tauri-apps/api/tauri";
import Image from "next/image";
import vaultLogo from "../assets/vault.png";
import FlashMessage from "react-native-flash-message";
import { showMessage, hideMessage } from "react-native-flash-message";

class Register extends React.Component {

    constructor(props) {
      super(props);
      this.state = {
        username: '',
        password: '',
      };
    }

   handleUsernameChange = (event) => {

         this.setState({username: event.target.value});
        
    }
    handlePasswordChange = (event) => {

          this.setState({password: event.target.value});
          
        
    }
    handleSubmit =  async (event) => {
        try{
        console.log("submit")
        event.preventDefault();
        if(this.state.username.length < 3 || this.state.password.length < 3)
        {
          showMessage({message: "Username and Password must be at least 3 characters long", type: "info", color: "red"})

          return;
        }
        console.log("username: " + this.state.username + " password: " + this.state.password)
        const response = await invoke("register", {
            name: this.state.username,
            password: this.state.password,
        });
        if(response)
        {
          showMessage({message: "Registration Successful", type: "success" ,color: "green"})
          window.location.href = "/index";
        }
        else
        {
          showMessage({message: "Registration Failed", type: "danger", color: "red"})
        }
        console.log("response" , response)
    } catch (error) {
        console.log("error", error)
        showMessage({message: "Registration Failed", type: "danger", color: "red"})
    }
    }


  render(){return (
    <div className = "main">
    <div className="container">
      <div className="form-box">
        <div className="header-form">
          <br></br>
          <Image
            src={vaultLogo}
            width={144}
            height={144}
            alt="vault"
            className="vault-logo"
          />
          <div className="image"></div>
        </div>
        <div className="body-form">
          <form>
            <div className="input-group mb-3">
              <div className="input-group-prepend">
                <span className="input-group-text">
                  <i className="fa fa-user"></i>
                </span>
              </div>
              <input
                type="text"
                className="form-control"
                placeholder="Username"
                onChange = {this.handleUsernameChange}
              />
            </div>

            <div className="input-group mb-3">
              <div className="input-group-prepend"></div>
              <input
                type="password"
                className="form-control"
                placeholder="Password"
                onChange = {this.handlePasswordChange}
              />
            </div>
            <div>
            </div>
            <button type="button" className="btn btn-secondary btn-block" onClick = {this.handleSubmit}>
              Register
            </button>
          </form>
        </div>
      </div>
     
    </div>
     <FlashMessage ref = "registerFlashMessage" position="bottom" />
    </div>
   

 
  );
}
 }


export default Register;