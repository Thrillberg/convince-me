import React, { PureComponent } from 'react';
import Chat from './Chat';
import Matchmaker from './Matchmaker';

export default class App extends PureComponent {
  constructor() {
    super();

    this.state = {
      inChat: false,
      uid: null,
      chatId: '123',
    };
  }

  componentDidMount() {
    // eslint-disable-next-line no-undef
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.setState({
          uid: user.uid,
        });
      }
    });
  }

  goToChat = () => {
    if (!this.state.uid) {
      /* eslint-disable */
      firebase.auth().signInAnonymously().catch((error) => {
        console.log(error);
      });
      /* eslint-enable */
    }

    // eslint-disable-next-line no-undef
    const database = firebase.database();
    database.ref(`chats/${this.state.chatId}`).set({
      uid: this.state.uid,
    });

    this.setState({
      inChat: true,
    });
  }

  cancel = () => {
    // eslint-disable-next-line no-undef
    const database = firebase.database();
    database.ref(`chats/${this.state.chatId}`).set({
      uid: null,
    });

    this.setState({
      inChat: false,
    });
  }

  render() {
    if (!this.state.inChat) {
      return (
        <Matchmaker
          goToChat={this.goToChat}
        />
      );
    }

    return (
      <Chat
        cancel={this.cancel}
        uid={this.state.uid}
      />
    );
  }
}
