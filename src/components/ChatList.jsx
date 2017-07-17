import React, { PureComponent } from 'react';
import Firebase from 'firebase';

export default class ChatList extends PureComponent {
  constructor() {
    super();

    this.state = {
      chats: {},
    };
  }

  componentDidMount() {
    this.getChats();
  }

  getChats() {
    const uid = Firebase.auth().currentUser.uid;
    Firebase.database().ref(`/users/${uid}`).once('value')
      .then((snapshot) => {
        if (snapshot.val()) {
          this.setState(snapshot.val());
        }
      })
      .catch((error) => {
        console.log(error); // eslint-disable-line no-console
      });
  }

  displayChats() {
    const chats = this.state.chats;

    return Object.keys(chats).map((key) => {
      const chat = <div className="chat" key={key}>{chats[key]}</div>;
      return chat;
    });
  }

  render() {
    return (
      <div className="chat-list well">
        <h3>
          Your chats
        </h3>
        {this.displayChats()}
      </div>
    );
  }
}
