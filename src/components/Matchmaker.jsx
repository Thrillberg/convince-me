import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

export default class Matchmaker extends PureComponent {
  render() {
    return (
      <div className="matchmaker">
        <a
          className="go-to-chat"
          onClick={this.props.goToChat}
          role="link"
          tabIndex={0}
        >
          Chat
        </a>
      </div>
    );
  }
}

Matchmaker.propTypes = {
  goToChat: PropTypes.func.isRequired,
};
