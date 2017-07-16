import Chat from '../Chat';

describe('Chat', () => {
  let component;
  let fakeAuthenticated;
  let fakeDatabase;
  let match;

  beforeEach(() => {
    fakeAuthenticated = sinon.stub(Firebase, 'auth').returns({
      currentUser: {
        uid: '123',
      },
    });

    fakeDatabase = sinon.stub(Firebase, 'database').returns({
      ref: sinon.stub().returns({
        set: sinon.stub(),
        on: sinon.stub(),
        push: sinon.spy(),
      }),
    });

    match = {
      params: {
        id: '123',
      },
    };

    component = shallow(
      <Chat match={match} />,
    );
  });

  afterEach(() => {
    fakeAuthenticated.restore();
    fakeDatabase.restore();
  });

  describe('initialization', () => {
    it('initializes with the correct state', () => {
      const expectedState = {
        chatInput: '',
        messages: [],
      };
      expect(component.state()).to.deep.eq(expectedState);
    });
  });

  describe('layout', () => {
    it('renders a chat', () => {
      expect(component.find('.chat').length).to.eq(1);
    });
  });

  describe('interaction', () => {
    describe('#handleTextInput', () => {
      it('sets the text to state', () => {
        const blasphemy = 'I support Trump';

        expect(component.state('chatInput')).to.eq('');

        component.instance().handleTextInput({
          target: {
            value: blasphemy,
          },
        });

        expect(component.state('chatInput')).to.eq(blasphemy);
      });
    });

    describe('#handleTextSubmit', () => {
      it('pushes the message to Firebase', () => {
        const commonSense = 'Bernie was actually right all along';
        const timestampStub = sinon.stub(Firebase, 'TIMESTAMP')
          .returns({ '.sv': 'timestamp' });
        const expectedArgs = {
          timestamp: timestampStub(),
          text: commonSense,
          sender: fakeAuthenticated().currentUser.uid,
        };
        const databaseCall = fakeDatabase().ref().push;

        component.setState({
          chatInput: commonSense,
        });

        component.instance().handleTextSubmit();

        expect(databaseCall.calledWith(expectedArgs)).to.eq(true);
      });
    });
  });
});
