import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

export default class Messages extends PureComponent {
  renderMessages() {
    return Object.keys(this.props.messages).map((key) => {
      const message = (
        <div key={key} className="message">
          <div className="text">
            {this.props.messages[key].text}
          </div>
        </div>
      );

      return message;
    });
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
  }).isRequired,
};
