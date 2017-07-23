import Firebase from 'firebase';
import { Link } from 'react-router-dom';
import { Row, Col, Button } from 'react-bootstrap';
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Messages from './Messages';

export default class Chat extends PureComponent {
  constructor() {
    super();

    this.state = {
      chatInput: '',
      messages: {},
      status: '',
      users: {},
    };
  }

  componentDidMount() {
    const uid = Firebase.auth().currentUser.uid;
    const usersRef = Firebase.database().ref(`chats/${this.props.match.params.id}/users`);
    const messagesRef = Firebase.database().ref(`chats/${this.props.match.params.id}/messages`);
    const chatsRef = Firebase.database().ref(`users/${uid}/chats`);
    const statusRef = Firebase.database().ref(`chats/${this.props.match.params.id}/status`);

    statusRef.on('value', (snapshot) => {
      this.setState({
        status: snapshot.val(),
      });
    });

    messagesRef.on('value', (snapshot) => {
      this.setState({
        messages: snapshot.val(),
      });
    });

    usersRef.on('value', (snapshot) => {
      if (snapshot.val().length === 2) {
        Firebase.database().ref(`chats/${this.props.match.params.id}/alerted_of_partner`).set(true);
      }

      this.setState({
        users: snapshot.val(),
      });
    });

    chatsRef.once('value')
      .then((snapshot) => {
        this.pushChatIdsToFirebase(snapshot, chatsRef);
      });
  }

  componentWillUnmount() {
    const uid = Firebase.auth().currentUser.uid;
    const usersRef = Firebase.database().ref(`chats/${this.props.match.params.id}/users`);
    const messagesRef = Firebase.database().ref(`chats/${this.props.match.params.id}/messages`);
    const chatsRef = Firebase.database().ref(`users/${uid}/chats`);
    const statusRef = Firebase.database().ref(`chats/${this.props.match.params.id}/status`);
    usersRef.off();
    messagesRef.off();
    chatsRef.off();
    statusRef.off();
  }

  getPartnerName = () => {
    const users = this.state.users;
    let partnerName;
    if (users) {
      Object.keys(users).map((key) => { // eslint-disable-line
        if (users[key] !== Firebase.auth().currentUser.uid) {
          partnerName = users[key];
          return partnerName;
        }
      });
      return partnerName;
    }
    return null;
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

  pushChatIdsToFirebase = (snapshot, chatsRef) => {
    if (snapshot.val()) {
      const chatIds = Object.keys(snapshot.val()).map((key) => {
        const chatId = snapshot.val()[key];
        return chatId;
      });

      if (chatIds.includes(this.props.match.params.id)) {
        return null;
      }
      chatsRef.push(this.props.match.params.id);
      return null;
    }
    chatsRef.push(this.props.match.params.id);
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
    const partnerName = this.getPartnerName();
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
