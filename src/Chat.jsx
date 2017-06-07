import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

export default class Chat extends PureComponent {
  render() {
    return (
      <div className="chat">
        Your id is {this.props.uid}.
        <a
          className="cancel"
          onClick={this.props.cancel}
          role="link"
          tabIndex={0}
        >
          Cancel
        </a>
      </div>
    );
  }
}

Chat.propTypes = {
  uid: PropTypes.string.isRequired,
  cancel: PropTypes.func.isRequired,
};
