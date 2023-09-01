import React, { useState } from "react";
import { invoke } from "@tauri-apps/api/tauri";
import Image from "next/image";
import vaultLogo from "../assets/vault.png";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
class Register extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: "",
      password_confirm: "",
    };
  }

  handleUsernameChange = (event) => {
    this.setState({ username: event.target.value });
  };
  handlePasswordChange = (event) => {
    this.setState({ password: event.target.value });
  };
  handlePasswordConfirmChange = (event) => {
    this.setState({ password_confirm: event.target.value });
  };
  handleSubmit = async (event) => {
    try {
      event.preventDefault();
      if (this.state.username.length < 3 || this.state.password.length < 3) {
        toast.warn("Username and Password must be at least 3 characters long", {
          theme: "dark",
        });
        this.setState({ username: "", password: "" });
        return;
      }
      if (this.state.password !== this.state.password_confirm) {
        toast.warn("Passwords do not match", { theme: "dark" });
        this.setState({ password: "", password_confirm: "" });
        return;
      }
      const response = await invoke("register", {
        name: this.state.username,
        password: this.state.password,
      });
      //console.log("response", response);
      if (!response.error) {
        toast.success("Registration Successful", { theme: "dark" });
        window.location.href = "/";
      } else {
        toast.error(response.message, { theme: "dark" });
      }
    } catch (error) {
      toast.error("Registration Failed", { theme: "dark" });
    }
  };

  render() {
    return (
      <div className="main">
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
                    value={this.state.username}
                    placeholder="Username"
                    onChange={this.handleUsernameChange}
                  />
                </div>

                <div className="input-group mb-3">
                  <div className="input-group-prepend"></div>
                  <input
                    type="password"
                    className="form-control"
                    value={this.state.password}
                    placeholder="Password"
                    onChange={this.handlePasswordChange}
                  />
                </div>
                <div></div>
                <div className="input-group mb-3">
                  <div className="input-group-prepend"></div>
                  <input
                    type="password"
                    className="form-control"
                    value={this.state.password_confirm}
                    placeholder="Re enter Password"
                    onChange={this.handlePasswordConfirmChange}
                  />
                </div>
                <div>
                  <button
                    type="button"
                    className="btn btn-secondary btn-block"
                    onClick={this.handleSubmit}
                  >
                    Register
                  </button>
                </div>
                <button
                  type="button"
                  className="btn btn-secondary btn-block"
                  onClick={() => {
                    window.location.href = "/index";
                  }}
                >
                  Back
                </button>
              </form>
              <ToastContainer />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Register;
