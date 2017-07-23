import PropTypes from 'prop-types';
import { Button, Row, Col } from 'react-bootstrap';
import React, { PureComponent } from 'react';
import Firebase from 'firebase';
import ReactModal from 'react-modal';
import ChatList from './ChatList';

export default class Matchmaker extends PureComponent {
  static getChats(chatIds, key) {
    return new Promise((resolve) => {
      const newRef = Firebase.database().ref('/chats/').orderByKey().equalTo(chatIds[key]);
      newRef.once('value')
        .then((snapshot) => {
          resolve({
            [chatIds[key]]: snapshot.val()[chatIds[key]],
          });
        });
    })
      .catch((error) => {
        console.log(error); // eslint-disable-line no-console
      });
  }

  constructor() {
    super();

    this.state = {
      chatsLoaded: false,
      chats: {},
      modalOpen: false,
      modalLink: '',
    };
  }

  componentDidMount() {
    this.setChatsToState();
  }

  setChatsToState() {
    const uid = Firebase.auth().currentUser.uid;

    Firebase.database().ref(`/users/${uid}/chats`).once('value')
      .then((snapshot) => {
        this.setState({
          chatsLoaded: true,
        });

        if (snapshot.val()) {
          const promises = Object.keys(snapshot.val()).map((key) => {
            const getChatsCall = Matchmaker.getChats(snapshot.val(), key);
            return getChatsCall;
          });

          Promise.all(promises)
            .then((results) => {
              let chats = {};
              results.forEach((chat) => {
                chats = Object.assign({}, chats, chat);
                this.listenForChatUpdates(Object.keys(chat)[0]);
              });
              this.setState({ chats });
            });
        }
      })
      .catch((error) => {
        console.log(error); // eslint-disable-line no-console
      });
  }

  getWaitingChat = (snapshot) => {
    const validChats = [];

    if (snapshot.val()) {
      Object.keys(snapshot.val()).map((key) => { // eslint-disable-line array-callback-return
        if (snapshot.val()[key].status === 'created') {
          validChats.push({ [key]: snapshot.val()[key] });
        }
      });

      if (validChats.length > 0) {
        this.redirectToChat(Object.keys(validChats[0])[0]);
      } else {
        this.redirectToChat();
      }
    } else {
      this.redirectToChat();
    }
  }

  setChatToStarted = (snapshot, chat) => {
    const partnerId = snapshot.val().users[0];
    const userId = Firebase.auth().currentUser.uid;
    if (snapshot.val().users.length === 1
      && partnerId !== userId) {
      const usersRef = Firebase.database().ref(`chats/${chat}/users`);
      usersRef.set([userId, partnerId]);

      const statusRef = Firebase.database().ref(`chats/${chat}/status`);

      statusRef.set('started');
      this.props.history.push(`/chats/${chat}`);
      return null;
    }

    this.props.history.push(`/chats/${chat}`);
    return null;
  }

  listenForChatUpdates = (chatId) => {
    Firebase.database().ref(`/chats/${chatId}`).on('value', (snapshot) => {
      const alertedOfPartner = snapshot.val().alerted_of_partner;
      const chats = this.state.chats;
      chats[chatId] = snapshot.val();

      this.setState({ chats });

      if (!alertedOfPartner && snapshot.val().users.length === 2) {
        Firebase.database().ref(`/chats/${chatId}/alerted_of_partner`).set(true);
        this.setState({
          modalOpen: true,
          modalLink: chatId,
        });
      }
    });
  }

  prepareGetWaitingChat = () => {
    const chatsRef = Firebase.database().ref('chats/');

    chatsRef.once('value')
      .then((snapshot) => {
        this.getWaitingChat(snapshot);
      });
  }

  prepareSetChatToStarted = (chat) => {
    const chatRef = Firebase.database().ref(`chats/${chat}`);
    chatRef.once('value')
      .then((snapshot) => {
        if (snapshot.val().users) {
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

    const chat = this.saveChat();
    this.props.history.push(`/chats/${chat.key}`);
    return null;
  }

  saveChat = () => {
    const chatsRef = Firebase.database().ref('chats/');
    const currentUid = Firebase.auth().currentUser.uid;

    return chatsRef.push({
      users: [currentUid],
      started_at: Firebase.database.ServerValue.TIMESTAMP,
      status: 'created',
    });
  }

  goToChat = () => {
    this.setState({
      modalOpen: false,
    });
    this.props.history.push(`/chats/${this.state.modalLink}`);
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
              onClick={this.prepareGetWaitingChat}
            >
              Chat Now
            </Button>
          </Col>
        </Row>
        <Row>
          <Col md={6} className="text-center centered">
            <ChatList
              chats={this.state.chats}
              chatsLoaded={this.state.chatsLoaded}
            />
          </Col>
        </Row>
        <ReactModal
          isOpen={this.state.modalOpen}
          contentLabel="Alert"
          className="Modal"
        >
          <h3 className="centered">
            Someone has joined your chat!
          </h3>
          <Button
            bsSize="large"
            bsStyle="primary"
            block
            onClick={this.goToChat}
          >
            Go to chat
          </Button>
        </ReactModal>
      </div>
    );
  }
}

Matchmaker.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func,
  }).isRequired,
};
