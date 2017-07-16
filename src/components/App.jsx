import Firebase from 'firebase';
import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';

export default class App extends PureComponent {
  constructor() {
    super();

    this.state = {
      user: null,
    };
  }

  componentDidMount() {
    if (!Firebase.auth().currentUser) {
      Firebase.auth().signInAnonymously().catch((error) => {
        console.log(error); // eslint-disable-line no-console
      });
    }

    Firebase.auth().onAuthStateChanged((user) => {
      this.setState({
        user,
      });
    });
  }

  render() {
    if (!Firebase.auth().currentUser) {
      return null;
    }

    return (
      <div>
        {this.props.children}
      </div>
    );
  }
}

App.propTypes = {
  children: PropTypes.arrayOf(
    PropTypes.object,
    PropTypes.object,
  ).isRequired,
};
