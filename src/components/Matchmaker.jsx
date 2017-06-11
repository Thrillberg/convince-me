import { Link } from 'react-router-dom';
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

export default class Matchmaker extends PureComponent {
  render() {
    const chatPath = `/chats/${this.props.chatId}`;

    return (
      <Link to={chatPath}>
        Chat
      </Link>
    );
  }
}

Matchmaker.propTypes = {
  chatId: PropTypes.string,
};

Matchmaker.defaultProps = {
  chatId: null,
};
