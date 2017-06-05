import React, { PureComponent } from 'react';
import Chat from './Chat';
import Matchmaker from './Matchmaker';

export default class App extends PureComponent {
  constructor() {
    super();

    this.state = {
      inChat: false,
      currentUser: {
        id: '123',
      },
    };
  }

  goToChat = () => {
    this.setState({
      inChat: true,
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
      <Chat currentUser={this.state.currentUser} />
    );
  }
}
