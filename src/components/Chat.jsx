import Firebase from 'firebase';
import { Link } from 'react-router-dom';
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

export default class Chat extends PureComponent {
  componentDidMount() {
    Firebase.auth().signInAnonymously().catch((error) => {
      console.log(error); // eslint-disable-line no-console
    });

    const database = Firebase.database();
    database.ref(`chats/${this.props.match.params.id}/users`).set({
      uid: Firebase.auth().currentUser.uid,
    });
  }

  render() {
    const rootPath = '/';

    return (
      <div className="chat">
        Your id is {Firebase.auth().currentUser.uid}.
        <Link to={rootPath}>
          Cancel
        </Link>
      </div>
    );
  }
}

Chat.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string,
    }),
  }).isRequired,
};
