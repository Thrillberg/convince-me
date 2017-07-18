import React, { PureComponent } from 'react';
import Firebase from 'firebase';
import Moment from 'moment';
import { Col, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export default class ChatList extends PureComponent {
  static getChats(chatIds, key) {
    return new Promise((resolve) => {
      const newRef = Firebase.database().ref('/chats/').orderByKey().equalTo(chatIds[key]);
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
      chats: {},
    };
  }

  componentDidMount() {
    this.setChatsToState();
  }

  setChatsToState() {
    const uid = Firebase.auth().currentUser.uid;

    Firebase.database().ref(`/users/${uid}/chats`).once('value')
      .then((snapshot) => {
        if (snapshot.val()) {
          const promises = Object.keys(snapshot.val()).map((key) => {
            const getChatsCall = ChatList.getChats(snapshot.val(), key);
            return getChatsCall;
          });

          Promise.all(promises)
            .then((results) => {
              let chats = {};
              results.forEach((chat) => {
                chats = Object.assign({}, chats, chat);
              });
              this.setState({ chats });
            });
        }
      })
      .catch((error) => {
        console.log(error); // eslint-disable-line no-console
      });
  }

  displayChats() {
    const chats = this.state.chats;
    const sortedChats = Object.keys(chats).sort((a, b) => {
      const orderedChat = chats[a].started_at - chats[b].started_at;
      return orderedChat;
    });
    const ended = (key) => {
      if (chats[key].status === 'ended') {
        const span = <span className="ended">Ended</span>;
        return span;
      }

      return null;
    };

    if (sortedChats.length) {
      return sortedChats.map((key) => {
        const chatPath = `/chats/${key}`;
        const chat = (
          <Row className="chat" key={key}>
            <Col md={6} className="chat-key-container">
              <Link to={chatPath} className="chat-key">{key}</Link>
              {ended(key)}
            </Col>
            <Col md={6}>
              {Moment(chats[key].started_at).format('dddd, M/D h:mm A')}
            </Col>
          </Row>
        );
        return chat;
      });
    }

    return (
      <h4>
        Loading...
      </h4>
    );
  }

  render() {
    return (
      <div className="chat-list well">
        <h3>
          Your chats
        </h3>
        <Row>
          <Col className="column-header" md={6}>
            Chat Id
          </Col>
          <Col className="column-header" md={6}>
            Date started
          </Col>
        </Row>
        {this.displayChats()}
      </div>
    );
  }
}
