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
    };
  }

  componentDidMount() {
    const uid = Firebase.auth().currentUser.uid;
    const usersRef = Firebase.database().ref(`chats/${this.props.match.params.id}/users`);
    const messagesRef = Firebase.database().ref(`chats/${this.props.match.params.id}/messages`);
    const chatsRef = Firebase.database().ref(`users/${uid}/chats`);
    const statusRef = Firebase.database().ref(`chats/${this.props.match.params.id}/status`);

    usersRef.set({
      uid: Firebase.auth().currentUser.uid,
    });

    messagesRef.on('value', ((snapshot) => {
      this.setState({
        messages: snapshot.val(),
      });
    }));

    chatsRef.once('value')
      .then((snapshot) => {
        this.pushChatIdsToFirebase(snapshot, chatsRef);
      });

    statusRef.on('value', ((snapshot) => {
      this.setState({
        status: snapshot.val(),
      });
    }));
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

  render() {
    return (
      <Row className="chat">
        <Col md={9}>
          <div>
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
