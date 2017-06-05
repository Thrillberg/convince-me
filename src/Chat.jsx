import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

export default class Chat extends PureComponent {
  render() {
    return (
      <div className="chat">
        Your id is {this.props.currentUser.id}.
      </div>
    );
  }
}

Chat.propTypes = {
  currentUser: PropTypes.obj.isRequired,
};
