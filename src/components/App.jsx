import Firebase from 'firebase';
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
    const config = {
      apiKey: 'AIzaSyAmECAdkdFnJJiRc2Ewc_DhSW-ekDyfhkI',
      authDomain: 'convince-me-9bcc5.firebaseapp.com',
      databaseURL: 'https://convince-me-9bcc5.firebaseio.com',
      projectId: 'convince-me-9bcc5',
      storageBucket: 'convince-me-9bcc5.appspot.com',
      messagingSenderId: '369300905872',
    };
    Firebase.initializeApp(config);

    Firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.setState({
          uid: user.uid,
        });
      }
    });
  }

  goToChat = () => {
    if (!this.state.uid) {
      Firebase.auth().signInAnonymously().catch((error) => {
        console.log(error); // eslint-disable-line no-console
      });
    }

    const database = Firebase.database();
    database.ref(`chats/${this.state.chatId}`).set({
      uid: this.state.uid,
    });

    this.setState({
      inChat: true,
    });
  }

  cancel = () => {
    const database = Firebase.database();
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
