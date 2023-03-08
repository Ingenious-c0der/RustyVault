import { useState } from "react";
import React from "react";
import { invoke } from "@tauri-apps/api/tauri";
import Image from "next/image";
import vaultLogo from "../assets/vault.png";

class App extends React.Component {

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
   if(this.state.username.length < 3 || this.state.password.length < 8)
   {
    // showMessage({message: "Username and Password must be at least 3 characters long", type: "info", color: "red"})

     return;
   }
   const response = await invoke("login", {
       name: this.state.username,
       password: this.state.password,
   });
   console.log("response" , response)  
   if(response)
   {
   //  showMessage({message: "Registration Successful", type: "success" ,color: "green"})
  
   window.location.href = "/homepage";
   }
   else
   {
    // showMessage({message: "Registration Failed", type: "danger", color: "red"})
   }
   console.log("response" , response)
} catch (error) {
   console.log("error", error)
  // showMessage({message: "Registration Failed", type: "danger", color: "red"})
}
}


  render() {
   
    return (
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
                  required minLength="3"
                  onChange={this.handleUsernameChange}
                />
              </div>

              <div className="input-group mb-3">
                <div className="input-group-prepend"></div>
                <input
                  type="password"
                  className="form-control"
                  placeholder="Password"
                  required minLength = "8" 
                  onChange={this.handlePasswordChange}
                />
              </div>
              <div>
                <button type="button" className="btn btn-secondary btn-block" onClick = {this.handleSubmit}>
                  Login
                </button>
              </div>
              <button
                type="button"
                className="btn btn-secondary btn-block"
                onClick={ ()=>{window.location.href = "/register"}}
              >
                Register
              </button>

              <div className="message">
                <div>
                  <input type="checkbox" /> Remember ME
                </div>
                <div>
                  <a href="#">Forgot your password</a>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
