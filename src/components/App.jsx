import Firebase from 'firebase';
import React, { PureComponent } from 'react';
import Matchmaker from './Matchmaker';

export default class App extends PureComponent {
  constructor() {
    super();

    this.state = {
      chatId: '123',
    };
  }

  render() {
    if (!Firebase.auth().currentUser) {
      return null;
    }

    return (
      <Matchmaker chatId={this.state.chatId} />
    );
  }
}
