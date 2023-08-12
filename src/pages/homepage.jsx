import React from "react";
import { Card, Button } from "react-bootstrap";
//import font awesome icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { MdVisibility, MdContentPaste } from "react-icons/md";


function UserSidebar({ user }) {
  return (
    <div className="sidebar">
      <div className="user-details">
        <img src={user.profilePicture} alt="Profile" className="profile-picture" />
        <p className="user-name">{user.name}</p>
      </div>
      <button className="logout-button" onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
}


class HomePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
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
            <Button title ="Copy Password to Clipboard" style = {{marginRight: "16px"}}>
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
            <Button title ="Copy Password to Clipboard" style = {{marginRight: "16px"}}>
              <MdContentPaste />
            </Button>
           
            <Button title ="Reveal Password">
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
