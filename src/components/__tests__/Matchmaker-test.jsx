import { Button } from 'react-bootstrap';
import Matchmaker from '../Matchmaker';
import ChatList from '../ChatList';

describe('Matchmaker', () => {
  let component;

  beforeEach(() => {
    component = shallow(<Matchmaker />);
  });

  describe('layout', () => {
    it('has a Chat Now button', () => {
      expect(component.find(Button).length).to.eq(1);
    });

    it('has a list of current chats', () => {
      expect(component.find(ChatList).length).to.eq(1);
    });
  });
});
