import { useState } from "react";
import React from "react";
import { invoke } from "@tauri-apps/api/tauri";
import Image from "next/image";
import vaultLogo from "../assets/vault_icon.png";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";



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
    toast.error("Invalid Username or Password")
    this.setState({username: '', password: ''})
     return;
   }
   const response = await invoke("login", {
       name: this.state.username,
       password: this.state.password,
   });
   console.log("response" , response)  
   if(response)
   {
    toast.success("Login Successful")
  
   window.location.href = "/homepage";
   }
   else
   {//stub for later in depth error messages
    toast.error("Login Failed")
    this.setState({username: '', password: ''})
   }
   console.log("response" , response)
} catch (error) {
   console.log("error", error)
    toast.error("Login Failed")
    this.setState({username: '', password: ''})
}
}


  render() {
   
    return (
      
      <div className="container" >
        <div>
        <h1 style={{color: "#f33514",fontFamily: "Montserrat" ,fontSize:100}}>Rusty Vault</h1>
        <h6 style={{color: "#f33514",fontFamily: "cursive"}}>v 0.0.1</h6>
        </div>
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
                  value = {this.state.username}
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
                  value = {this.state.password}
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

              
            </form>
            <ToastContainer />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
