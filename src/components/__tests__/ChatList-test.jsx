import { Link } from 'react-router-dom';
import ChatList from '../ChatList';

describe('ChatList', () => {
  let component;
  let fakeAuthenticated;
  let fakeDatabase;

  beforeEach(() => {
    fakeAuthenticated = sinon.stub(Firebase, 'auth').returns({
      currentUser: {
        uid: '123',
      },
    });

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

    component = shallow(<ChatList />);
  });

  afterEach(() => {
    fakeAuthenticated.restore();
    fakeDatabase.restore();
  });

  describe('initialization', () => {
    it('initializes with the correct state', () => {
      const expectedState = {
        chatsLoaded: false,
        chats: {},
      };

      expect(component.state()).to.deep.eq(expectedState);
    });

    describe('#setChatsToState', () => {
      it('sets chats from Firebase to state', () => {
        const expectedState = {
          chats: {
            firstChat: 'a chat here',
            secondChat: 'another chat here',
          },
        };
        const databaseCall = fakeDatabase().ref().once;
        const snapshotStub = {
          val: sinon.stub().returns(expectedState.chats),
        };
        databaseCall.resolves(snapshotStub);
        expect(component.state()).to.deep.eq({
          chatsLoaded: false,
          chats: {},
        });

        component.instance().setChatsToState();

        expect(databaseCall.calledWith('value')).to.eq(true);
      });
    });
  });

  describe('layout', () => {
    it('has a header', () => {
      expect(component.find('h3').length).to.eq(1);
      expect(component.find('.column-header').length).to.eq(3);
    });

    describe('#displayChats', () => {
      it('orders chat by started_at', () => {
        component.setState({
          chatsLoaded: true,
          chats: {
            first: {
              key: 'first-key',
              started_at: 123,
              status: 'ended',
            },
            second: {
              key: 'second-key',
              started_at: 1245,
            },
          },
        });

        expect(component.find(Link).at(0).prop('to')).to.eq('/chats/first');
        expect(component.find('span').text()).to.eq('Ended');
        expect(component.find('span').length).to.eq(1);
        expect(component.find(Link).at(1).prop('to')).to.eq('/chats/second');
      });
    });
  });

  describe('interaction', () => {
  });
});
