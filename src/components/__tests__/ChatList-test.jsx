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
        expect(component.state()).to.deep.eq({ chats: {} });

        component.instance().setChatsToState();

        expect(databaseCall.calledWith('value')).to.eq(true);
      });
    });
  });

  describe('layout', () => {
    it('has a header', () => {
      expect(component.find('h3').length).to.eq(1);
      expect(component.find('.column-header').length).to.eq(2);
    });
  });
});
