import Firebase from 'firebase';
import React from 'react';
import ReactDOM from 'react-dom';

import App from './components/App';

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
    React.createElement(App),
    document.getElementById('app'),
  );
});
