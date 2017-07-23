import PropTypes from 'prop-types';
import { Button, Row, Col } from 'react-bootstrap';
import React, { PureComponent } from 'react';
import Firebase from 'firebase';
import ReactModal from 'react-modal';
import ChatList from './ChatList';
import DogBreeds from '../helpers/DogBreeds';
import FirebaseRefs from '../helpers/FirebaseRefs';

export default class Matchmaker extends PureComponent {
  static getChats(chatIds, key) {
    return new Promise((resolve) => {
      const newRef = FirebaseRefs.chatsRef().orderByKey().equalTo(chatIds[key]);
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
    this.userChatsCall(this.setChatsToState);
  }

  userChatsCall = (method) => {
    const uid = Firebase.auth().currentUser.uid;
    FirebaseRefs.userChatsRef(uid).on('value', (chatsSnapshot) => {
      method(chatsSnapshot.val())
    });
  }

  chatsCall = (method) => {
    FirebaseRefs.chatsRef().once('value')
      .then((chatsSnapshot) => {
        method(chatsSnapshot.val());
      });
  }

  chatCall = (method, id) => {
    FirebaseRefs.chatsRef().child(id).once('value')
      .then((chatSnapshot) => {
        method(chatSnapshot.val(), id)
      });
  }

  setChatsToState = (chats) => {
    if (chats) {
      const promises = this.getChatsCalls(chats);

      Promise.all(promises)
        .then((results) => {
          this.assembleChats(results);
        });
    }

    this.setState({
      chatsLoaded: true,
    });
  }

  getChatsCalls = (chats) => {
    const chatIds = Object.keys(chats);
    return chatIds.map((id) => {
      const getChatsCall = Matchmaker.getChats(chats, id);
      return getChatsCall;
    });
  }

  assembleChats = (results) => {
    let chats = {};
    results.forEach((chat) => {
      chats = Object.assign({}, chats, chat);
      const chatId = Object.keys(chat)[0];
      this.chatCall(this.listenForChatUpdates, chatId);
    });

    this.setState({ chats });
  }

  getWaitingChat = (chats) => {
    const validChats = [];

    if (chats) {
      const chatIds = Object.keys(chats);
      chatIds.map((id) => {
        if (chats[id].status === 'created') {
          validChats.push({ [id]: chats[id] });
        }
        return null;
      });

      if (validChats.length > 0) {
        const firstValidChatId = Object.keys(validChats[0])[0];
        this.redirectToChat(firstValidChatId);
        return null;
      }
    }
    this.redirectToChat();
  }

  generateDisplayName() {
    return DogBreeds.getBreed();
  }

  setChatToStarted = (chat, chatId) => {
    if (chat.users) {
      const userIds = Object.keys(chat.users);
      const partnerId = userIds[0];
      const userId = Firebase.auth().currentUser.uid;
      if (userIds.length === 1 && partnerId !== userId) {
        const userRef = Firebase.database().ref(`chats/${chatId}/users/${partnerId}`);
        const displayName = this.generateDisplayName();
        userRef.set(displayName);

        const statusRef = Firebase.database().ref(`chats/${chatId}/status`);

        statusRef.set('started');
        this.props.history.push(`/chats/${chatId}`);
        return null;
      }

      this.props.history.push(`/chats/${chatId}`);
      return null;
    }
  }

  listenForChatUpdates = (chat, chatId) => {
    const alertedOfPartner = chat.alerted_of_partner;
    const chats = this.state.chats;
    chats[chatId] = chat;

    this.setState({ chats });

    if (!alertedOfPartner && chat.users.length === 2) {
      Firebase.database().ref(`/chats/${chatId}/alerted_of_partner`).set(true);
      this.setState({
        modalOpen: true,
        modalLink: chatId,
      });
    }
  }

  prepareGetWaitingChat = () => {
    this.chatsCall(this.getWaitingChat);
  }

  prepareSetChatToStarted = (chatId) => {
    this.chatCall(this.setChatToStarted, chatId);
  }

  redirectToChat = (waitingChatId) => {
    if (waitingChatId) {
      this.prepareSetChatToStarted(waitingChatId);
      this.props.history.push(`chats/${waitingChatId}`);
      return null;
    }

    this.redirectToNewChat();
    return null;
  }

  redirectToNewChat = () => {
    const chat = this.saveChat();
    const displayName = this.generateDisplayName();
    Firebase.database().ref(`chats/${chat.key}/users/${Firebase.auth().currentUser.uid}`).set(displayName);
    this.props.history.push(`/chats/${chat.key}`);
  }

  saveChat = () => {
    const chatsRef = Firebase.database().ref('chats/');

    return chatsRef.push({
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
