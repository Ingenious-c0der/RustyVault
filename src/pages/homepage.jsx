import React from 'react';
import {Card,Button} from 'react-bootstrap';


class HomePage extends React.Component {
    constructor(props) {
      super(props);
      this.state = {

      }
    }
    render() {
      return (
        <div className="container">
        <Card style={{ width: '18rem' }}>
          <Card.Img variant="top" src="https://png.pngtree.com/png-clipart/20190903/original/pngtree-black-cartoon-key-png-image_4438183.jpg" width = "100px"/>
          <Card.Body>
            <Card.Title>Card Title</Card.Title>
            <Card.Text>
              Some quick example text to build on the card title and make up the
              bulk of the card's content.
            </Card.Text>
            <Button variant="primary">Go somewhere</Button>
          </Card.Body>
        </Card>
        </div>
      );
      }
}
export default HomePage;