import { Link } from 'react-router-dom';
import { Button, Row, Col } from 'react-bootstrap';
import React, { PureComponent } from 'react';
import Firebase from 'firebase';
import ChatList from './ChatList';

export default class Matchmaker extends PureComponent {
  constructor() {
    super();

    this.state = {
      chatId: '',
    };
  }

  componentDidMount() {
    this.setState({
      chatId: Math.floor(Math.random() * 100000000),
    });
  }

  saveChat = () => {
    const chatRef = Firebase.database().ref(`chats/${this.state.chatId}`);

    chatRef.set({
      started_at: Firebase.database.ServerValue.TIMESTAMP
    });
  }

  render() {
    const chatPath = `/chats/${this.state.chatId}`;

    return (
      <div className="matchmaker">
        <Row>
          <Col md={6} className="text-center centered">
            <Link to={chatPath}>
              <Button
                bsStyle="primary"
                bsSize="large"
                block
                onClick={this.saveChat}>
                Chat Now
              </Button>
            </Link>
          </Col>
        </Row>
        <Row>
          <Col md={6} className="text-center centered">
            <ChatList />
          </Col>
        </Row>
      </div>
    );
  }
}

