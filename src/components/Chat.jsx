import Firebase from 'firebase';
import { Link } from 'react-router-dom';
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Messages from './Messages';

export default class Chat extends PureComponent {
  constructor() {
    super();

    this.state = {
      chatInput: '',
      messages: {},
    };
  }

  componentDidMount() {
    const usersRef = Firebase.database().ref(`chats/${this.props.match.params.id}/users`);
    const messagesRef = Firebase.database().ref(`chats/${this.props.match.params.id}/messages`);

    usersRef.set({
      uid: Firebase.auth().currentUser.uid,
    });

    messagesRef.on('value', ((snapshot) => {
      this.setState({
        messages: snapshot.val(),
      });
    }));
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

  renderMessages() {
    return (
      <Messages messages={this.state.messages} />
    );
  }

  render() {
    const rootPath = '/';

    return (
      <div className="chat">
        Your id is {Firebase.auth().currentUser.uid}.
        <Link to={rootPath}>
          Cancel
        </Link>
        <div>
          {this.renderMessages()}
        </div>
        <form onSubmit={this.handleTextSubmit}>
          <input
            type="text"
            value={this.state.chatInput}
            onChange={this.handleTextInput}
            placeholder="Type your message here"
          />
        </form>
      </div>
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
