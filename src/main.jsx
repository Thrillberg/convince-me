import { BrowserRouter as Router, Route, BrowserRouter, withRouter } from 'react-router-dom';
import Firebase from 'firebase';
import React from 'react';
import ReactDOM from 'react-dom';

import Stylesheet from '../convince-me.css';
import App from './components/App';
import Matchmaker from './components/Matchmaker';
import Chat from './components/Chat';

document.addEventListener('DOMContentLoaded', () => {
  const config = {
    apiKey: 'AIzaSyAmECAdkdFnJJiRc2Ewc_DhSW-ekDyfhkI',
    authDomain: 'convince-me-9bcc5.firebaseapp.com',
    databaseURL: 'https://convince-me-9bcc5.firebaseio.com',
    projectId: 'convince-me-9bcc5',
    storageBucket: 'convince-me-9bcc5.appspot.com',
    messagingSenderId: '369300905872',
  };
  Firebase.initializeApp(config);

  const UnblockingRoute = withRouter(App);

  ReactDOM.render(
    <Router history={BrowserRouter}>
      <UnblockingRoute location={location}>
        <Route exact path="/" component={Matchmaker} />
        <Route path="/chats/:id" component={Chat} />
      </UnblockingRoute>
    </Router>,
    document.getElementById('app'),
  );
});
