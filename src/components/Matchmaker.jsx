import { Link } from 'react-router-dom';
import React, { PureComponent } from 'react';

export default class Matchmaker extends PureComponent {
  render() {
    const chatId = Math.floor(Math.random() * 100000000);

    const chatPath = `/chats/${chatId}`;

    return (
      <div>
        <Link to={chatPath}>
          Chat Now
        </Link>
      </div>
    );
  }
}

