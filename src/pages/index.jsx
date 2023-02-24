import { useState} from "react";
import React from 'react'; 
import { invoke } from "@tauri-apps/api/tauri";
import Image from "next/image";
import vaultLogo from "../assets/vault.png";

class App extends React.Component{
  render(){
    return(
       <div className="container">
        <div className="form-box">
          <div className="header-form">
            <br></br>
            <Image src = {vaultLogo} width = {144} height = {144} alt="vault" className="vault-logo" />
            <div className="image">
            </div>
          </div>
          <div className="body-form">
           <form>
              <div className="input-group mb-3">
   <div className="input-group-prepend">
    <span className="input-group-text"><i className="fa fa-user"></i></span>
  </div>
  <input type="text" className="form-control" placeholder="Username" />
</div>

 <div className="input-group mb-3">
   <div className="input-group-prepend">
  </div>
  <input type="password" className="form-control" placeholder="Password" />
</div>
<div> 
<button type="button" className="btn btn-secondary btn-block">Login</button>
</div>
<button type="button" className="btn btn-secondary btn-block">Register</button>

 <div className="message">
<div><input type="checkbox" /> Remember ME</div>
 <div><a href="#">Forgot your password</a></div>
 </div>
   </form>
          </div>
        </div>
       </div>   
    )
  }
}

export default App;
