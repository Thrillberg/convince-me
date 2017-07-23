import { Link } from 'react-router-dom';
import ChatList from '../ChatList';

describe('ChatList', () => {
  let component;
  let fakeDatabase;
  let chats;
  let chatsLoaded;

  beforeEach(() => {
    fakeDatabase = sinon.stub(Firebase, 'database').returns({
      ref: sinon.stub().returns({
        once: sinon.stub(Firebase, 'once'),
        orderByKey: sinon.stub(Firebase, 'orderByKey').returns({
          equalTo: sinon.stub(Firebase, 'equalTo').returns({
            once: sinon.stub(Firebase, 'once').returns({
              then: sinon.spy(),
            }),
          }),
        }),
      }),
    });

    chats = {
      firstChat: {
        status: 'ended',
        nonsense: 'a chat here',
      },
      secondChat: {
        status: 'started',
        nonsense: 'another chat here',
      },
    };

    chatsLoaded = true;

    component = shallow(
      <ChatList
        chatsLoaded={chatsLoaded}
        chats={chats}
      />);
  });

  afterEach(() => {
    fakeDatabase.restore();
  });

  describe('layout', () => {
    it('has a header', () => {
      expect(component.find('h3').length).to.eq(1);
      expect(component.find('.column-header').length).to.eq(3);
    });

    describe('#displayChats', () => {
      it('orders chat by started_at', () => {
        expect(component.find(Link).at(0).prop('to')).to.eq('/chats/firstChat');
        expect(component.find('span').text()).to.eq('Ended');
        expect(component.find('span').length).to.eq(1);
        expect(component.find(Link).at(1).prop('to')).to.eq('/chats/secondChat');
      });
    });
  });
});
