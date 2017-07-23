import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Moment from 'moment';
import { Col, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export default class ChatList extends PureComponent {
  displayChats() {
    if (this.props.chatsLoaded) {
      const chats = this.props.chats;
      const sortedChats = Object.keys(chats).sort((a, b) => {
        const orderedChat = chats[a].started_at - chats[b].started_at;
        return orderedChat;
      });
      const ended = (key) => {
        if (chats[key].status === 'ended') {
          const span = <span className="ended">Ended</span>;
          return span;
        }

        return null;
      };

      if (sortedChats.length) {
        return sortedChats.map((key) => {
          const chatPath = `/chats/${key}`;
          const chat = (
            <Row className="chat" key={key}>
              <Col md={4} className="chat-key-container">
                <Link to={chatPath} className="chat-key">
                  {key}
                </Link>
                {ended(key)}
              </Col>
              <Col md={4}>
                {chats[key].status}
              </Col>
              <Col md={4}>
                {Moment(chats[key].started_at).format('dddd, M/D h:mm A')}
              </Col>
            </Row>
          );
          return chat;
        });
      }

      return (
        <h4>
          You have no chats yet!
        </h4>
      );
    }

    return (
      <h4>
        Loading...
      </h4>
    );
  }

  render() {
    return (
      <div className="chat-list well">
        <h3>
          Your chats
        </h3>
        <Row>
          <Col className="column-header" md={4}>
            Chat Id
          </Col>
          <Col className="column-header" md={4}>
            Status
          </Col>
          <Col className="column-header" md={4}>
            Date started
          </Col>
        </Row>
        {this.displayChats()}
      </div>
    );
  }
}

ChatList.propTypes = {
  chatsLoaded: PropTypes.bool.isRequired,
  chats: PropTypes.shape({
    users: PropTypes.array,
    started_at: PropTypes.number,
    status: PropTypes.string,
  }).isRequired,
};

ChatList.defaultProps = {
  chats: PropTypes.shape({
    users: [],
    started_at: null,
    status: '',
  }),
};
