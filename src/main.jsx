import { BrowserRouter as Router, Route } from 'react-router-dom';
import Firebase from 'firebase';
import React from 'react';
import ReactDOM from 'react-dom';

import App from './components/App';
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

  ReactDOM.render(
    <Router>
      <div>
        <Route exact path="/" component={App} />
        <Route path="/chats/:id" component={Chat} />
      </div>
    </Router>,
    document.getElementById('app'),
  );
});
