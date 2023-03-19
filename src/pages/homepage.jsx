import React from 'react';
import {Card,Button} from 'react-bootstrap';
//import font awesome icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

class HomePage extends React.Component {
    constructor(props) {
      super(props);
      this.state = {

      }
    }
    render() {
      return (
        <div className="container">
        <Card  style={{ overflow:true,opacity:0.9,backgroundColor:"",padding: "10px", width: '15rem' ,border: "solid 3px #540f00" ,borderRadius:"30px"}}>
          <Card.Img variant="top" style = {{borderRadius:"10px" }}src="https://t3.ftcdn.net/jpg/03/86/50/54/240_F_386505487_omkU0kGEhMa3gQ83rVksoXX41AFFfi0K.jpg" width = "100px"/>
          <Card.Body>

            <div>
              <Button>Copy to Clipboard</Button>
            </div>
            <Button >Reveal</Button>
          </Card.Body>
        </Card>
        </div>
      );
      }
}
export default HomePage;