import { Link } from 'react-router-dom';
import { Button, Row, Col } from 'react-bootstrap';
import React, { PureComponent } from 'react';
import ChatList from './ChatList';

export default class Matchmaker extends PureComponent {
  render() {
    const chatId = Math.floor(Math.random() * 100000000);

    const chatPath = `/chats/${chatId}`;

    return (
      <div className="matchmaker">
        <Row>
          <Col md={6} className="text-center centered">
            <Link to={chatPath}>
              <Button bsStyle="primary" bsSize="large" block>
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

