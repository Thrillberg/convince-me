import Firebase from 'firebase';
import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import App from '../App';

import Matchmaker from '../Matchmaker';

describe('App', () => {
  let fakeFirebaseInitialize;
  let fakeAuthenticated;
  let component;

  beforeEach(() => {
    fakeFirebaseInitialize = sinon.stub(Firebase, 'initializeApp');
  });

  afterEach(() => {
    fakeFirebaseInitialize.restore();
  });

  describe('before chatting', () => {
    beforeEach(() => {
      fakeAuthenticated = sinon.stub(Firebase, 'auth').returns({
        currentUser: true,
      });

      component = shallow(<App />);
    });

    afterEach(() => {
      fakeAuthenticated.restore();
    });

    it('renders a matchmaker', () => {
      expect(component.find(Matchmaker).length).to.equal(1);
    });
  });

  describe('unauthenticated', () => {
    beforeEach(() => {
      fakeAuthenticated = sinon.stub(Firebase, 'auth').returns({
        currentUser: false,
      });

      component = shallow(<App />);
    });

    afterEach(() => {
      fakeAuthenticated.restore();
    });

    it('renders null', () => {
      expect(component.find(Matchmaker).length).to.equal(0);
    });
  });
});
