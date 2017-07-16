import Firebase from 'firebase';
import PropTypes from 'prop-types';
import { Jumbotron, Grid, Row, Col } from 'react-bootstrap';
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
        <Jumbotron>
          <h1 className="text-center">
            Convince Me
          </h1>
        </Jumbotron>
        <Grid>
          <Row>
            <Col md={12}>
              {this.props.children}
            </Col>
          </Row>
        </Grid>
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
