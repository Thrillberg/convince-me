import React, { PureComponent } from 'react';
import Moment from 'moment';
import PropTypes from 'prop-types';

export default class Messages extends PureComponent {
  renderMessages() {
    const messages = this.props.messages;

    if (messages) {
      return Object.keys(messages).map((key) => {
        const message = (
          <div key={key} className="message">
            <span className="timestamp">
              {Moment(messages[key].timestamp).format('dddd, M/D h:mm A')}
            </span>
            <span className="text">
              {messages[key].text}
            </span>
          </div>
        );

        return message;
      });
    }

    return null;
  }

  render() {
    return (
      <div className="messages">
        {this.renderMessages()}
      </div>
    );
  }
}

Messages.propTypes = {
  messages: PropTypes.shape({
    message: PropTypes.shape({
      text: PropTypes.string,
      sender: PropTypes.string,
      timestamp: PropTypes.string,
    }),
  }),
};

Messages.defaultProps = {
  messages: {},
};
