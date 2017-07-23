import Firebase from 'firebase';
import { Link } from 'react-router-dom';
import { Row, Col, Button } from 'react-bootstrap';
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Messages from './Messages';
import FirebaseRefs from '../helpers/FirebaseRefs';
import DogBreeds from '../helpers/DogBreeds';

export default class Chat extends PureComponent {
  constructor() {
    super();

    this.state = {
      chatInput: '',
      messages: {},
      status: '',
      users: [],
      partnerName: '',
    };
  }

  componentDidMount() {
    const uid = Firebase.auth().currentUser.uid;
    const chatId = this.props.match.params.id;

    this.setChatToState(chatId);
    this.populateFirebase(uid);
  }

  setChatToState(chatId) {
    FirebaseRefs.chatRef(chatId).on('value', (snapshot) => {
      const chat = snapshot.val();
      if (chat.users.length === 2) {
        FirebaseRefs.chatAlertedOfPartnerRef.set(true);
      }
      this.setState({
        status: chat.status,
        messages: chat.messages,
        users: chat.users,
      }, () => this.getPartnerName(chatId));

      FirebaseRefs.chatRef(chatId).on('child_changed', (data) => {
        console.log(data.key)
        this.setState({
          [data.key]: data.val(),
        });
      });
    });
  }

  populateFirebase(uid) {
    const userRef = FirebaseRefs.userRef(uid);
    userRef.on('value', ((snapshot) => {
      this.pushChatIdsToFirebase(snapshot, userRef);
      this.pushDisplayNameToFirebase(snapshot);
    }));
  }

  getPartnerName = (chatId) => {
    const userIds = Object.keys(this.state.users);
    if (userIds) {
      userIds.map((uid) => { // eslint-disable-line
        if (uid !== Firebase.auth().currentUser.uid) {
          this.getPseudonym(uid, chatId, this.setPartnerNameToState);
        }
      });
      return null;
    }
    return null;
  }

  setPartnerNameToState = (partnerName) => {
    this.setState({partnerName});
  }

  getPseudonym = (uid, chatId, callback) => {
    const chatUserIds = Object.keys(FirebaseRefs.chatUsersRef(chatId));
    if (chatUserIds.include(uid)) {
      callback(FirebaseRefs.chatUsersRef(chatId)[uid]);
    }

    const pseudonym = DogBreeds.getDisplayName();
    callback(pseudonym);
  }

  handleTextInput = (event) => {
    this.setState({ chatInput: event.target.value });
  }

  handleTextSubmit = (event) => {
    const messagesRef = Firebase.database().ref(`chats/${this.props.match.params.id}/messages`);

    messagesRef.push({
      timestamp: Firebase.database.ServerValue.TIMESTAMP,
      text: this.state.chatInput,
      sender: Firebase.auth().currentUser.uid,
    });

    this.setState({ chatInput: '' });

    event.preventDefault();
  }

  pushChatIdsToFirebase = (snapshot, userRef) => {
    if (snapshot.val()) {
      const chatIds = Object.keys(snapshot.val().chats).map((key) => {
        const chatId = snapshot.val().chats[key];
        return chatId;
      });

      if (chatIds.includes(this.props.match.params.id)) {
        return null;
      }
      userRef.child('chats').push(this.props.match.params.id);
      return null;
    }
    userRef.child('chats').push(this.props.match.params.id);
    return null;
  }

  pushDisplayNameToFirebase = (snapshot) => {
    if (snapshot.val() && snapshot.val().displayName) {
      return null;
    }

    const displayName = Firebase.auth().currentUser.displayName;
    Firebase.database().ref(`users/${Firebase.auth().currentUser.uid}/displayName`).set(displayName);
    return null;
  }

  endChat = () => {
    const chatRef = Firebase.database().ref(`chats/${this.props.match.params.id}/status`);
    chatRef.set('ended');
    return null;
  }

  renderButtons = () => {
    const rootPath = '/';

    if (this.state.status === 'ended') {
      return (
        <Col md={3}>
          <Link to={rootPath}>
            <Button
              bsStyle="primary"
              block
            >
              Back Home
            </Button>
          </Link>
        </Col>
      );
    }
    return (
      <Col md={3}>
        <Link to={rootPath}>
          <Button
            bsStyle="primary"
            block
          >
            Back Home
          </Button>
        </Link>
        <Link to={rootPath}>
          <Button
            bsStyle="danger"
            block
            onClick={this.endChat}
          >
            End Chat
          </Button>
        </Link>
      </Col>
    );
  }

  renderInput() {
    if (this.state.status !== 'ended') {
      return (
        <form onSubmit={this.handleTextSubmit}>
          <input
            type="text"
            value={this.state.chatInput}
            onChange={this.handleTextInput}
            placeholder="Type your message here"
          />
        </form>
      );
    }

    return (
      <div>This chat has ended.</div>
    );
  }

  renderMessages() {
    return (
      <Messages messages={this.state.messages} />
    );
  }

  renderPartnerName = () => {
    const partnerName = this.state.partnerName;
    if (partnerName) {
      return (
        <div>
          Your partner is {partnerName}
        </div>
      );
    }

    return (
      <div>
        Waiting for a partner...
      </div>
    );
  }

  render() {
    return (
      <Row className="chat">
        <Col md={9}>
          <div>
            {this.renderPartnerName()}
            {this.renderMessages()}
          </div>
          {this.renderInput()}
        </Col>
        {this.renderButtons()}
      </Row>
    );
  }
}

Chat.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string,
    }),
  }).isRequired,
};
