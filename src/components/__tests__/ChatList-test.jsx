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

    describe('#getChats', () => {
      it('gets chats from Firebase', () => {
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

        component.instance().getChats();

        expect(databaseCall.calledWith('value')).to.eq(true);
        // expect(component.state()).to.deep.eq(expectedState);
      });
    });
  });

  describe('layout', () => {

  });
});
