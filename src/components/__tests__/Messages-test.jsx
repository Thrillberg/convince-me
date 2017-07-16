import Messages from '../Messages';

describe('Messages', () => {
  let component;
  let firstMessage;
  let secondMessage;

  beforeEach(() => {
    firstMessage = {
      text: 'My name is Mudd.',
      timestamp: '1122334455',
      sender: '123',
    };

    secondMessage = {
      text: 'Nice to meet you, Mudd.',
      timestamp: '5544332211',
      sender: '321',
    };

    component = shallow(<Messages messages={{ firstMessage, secondMessage }} />);
  });

  describe('initialization', () => {

  });

  describe('layout', () => {
    it('displays messages from state', () => {
      expect(component.find('.message').length).to.eq(2);
    });
  });
});
