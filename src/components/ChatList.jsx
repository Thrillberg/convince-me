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

    if (chats) {
      return Object.keys(chats).map((key) => {
        const chatPath = `/chats/${key}`;
        const chat = (
          <Row className="chat" key={key}>
            <Col md={6}>
              <Link to={chatPath}>{key}</Link>
            </Col>
            <Col md={6}>
              {Moment(chats[key].started_at).format('dddd, M/D h:mm A')}
            </Col>
          </Row>
        );
        return chat;
      });
    }

    return null;
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