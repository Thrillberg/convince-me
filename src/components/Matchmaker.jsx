import PropTypes from 'prop-types';
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

  componentWillMount() {
    this.setState({
      chatId: Math.floor(Math.random() * 100000000),
    });
  }

  getWaitingChat = (snapshot, callback) => {
    const validChats = [];

    if (snapshot.val()) {
      Object.keys(snapshot.val()).map((key) => { // eslint-disable-line array-callback-return
        if (snapshot.val()[key].status === 'created') {
          validChats.push({ [key]: snapshot.val()[key] });
        }
      });

      if (validChats.length > 0) {
        callback(Object.keys(validChats[0])[0]);
      } else {
        callback();
      }
    } else {
      callback();
    }
  }

  setChatToStarted = (snapshot, chat) => {
    if (Object.keys(snapshot.val().users).length === 1) {
      const statusRef = Firebase.database().ref(`chats/${chat}/status`);

      statusRef.set('started');
      this.props.history.push(`/chats/${chat}`);
    }

    this.props.history.push(`/chats/${chat}`);
  }

  prepareGetWaitingChat = (callback) => {
    const chatsRef = Firebase.database().ref('chats/');

    chatsRef.once('value')
      .then((snapshot) => {
        this.getWaitingChat(snapshot, callback);
      });
  }

  prepareSetChatToStarted = (chat) => {
    const chatRef = Firebase.database().ref(`chats/${chat}`);
    chatRef.once('value')
      .then((snapshot) => {
        if (Object.values(snapshot.val().users)[0]
          !== Firebase.auth().currentUser.uid) {
          this.setChatToStarted(snapshot, chat);
        }
      });
  }

  redirectToChat = (waitingChatId) => {
    if (waitingChatId) {
      this.prepareSetChatToStarted(waitingChatId);
      this.props.history.push(`chats/${waitingChatId}`);
      return null;
    }

    this.saveChat();
    this.props.history.push(`/chats/${this.state.chatId}`);
    return null;
  }

  saveChat = () => {
    const chatRef = Firebase.database().ref(`chats/${this.state.chatId}`);

    chatRef.set({
      started_at: Firebase.database.ServerValue.TIMESTAMP,
      status: 'created',
    });
  }

  render() {
    return (
      <div className="matchmaker">
        <Row>
          <Col md={6} className="text-center centered">
            <Button
              bsStyle="primary"
              bsSize="large"
              block
              onClick={() => this.prepareGetWaitingChat(this.redirectToChat)}
            >
              Chat Now
            </Button>
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


Matchmaker.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func,
  }).isRequired,
};
