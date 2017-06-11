import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import App from '../App';

import Matchmaker from '../Matchmaker';

describe('App', () => {
  const component = shallow(<App />);

  describe('before chatting', () => {
    it('renders a matchmaker', () => {
      expect(component.find(Matchmaker).length).to.equal(1);
    });
  });

  describe('while chatting', () => {

  });
});
