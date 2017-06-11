import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import App from '../App';

import Chat from '../Chat';
import Matchmaker from '../Matchmaker';

describe('App', () => {
  const component = shallow(<App />);

  describe('before chatting', () => {
    beforeEach(() => {
      component.setState({
        inChat: false,
      });
    });

    it('renders a matchmaker', () => {
      expect(component.find(Matchmaker).length).to.equal(1);
    });
  });

  describe('while chatting', () => {
    beforeEach(() => {
      component.setState({
        inChat: true,
        uid: '123',
      });
    });

    it('renders a chat', () => {
      expect(component.find(Chat).length).to.equal(1);
    });
  });
});
