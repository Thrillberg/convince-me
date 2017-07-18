import { Button } from 'react-bootstrap';
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
        messages: {},
        status: '',
      };
      expect(component.state()).to.deep.eq(expectedState);
    });
  });

  describe('layout', () => {
    it('renders a chat', () => {
      expect(component.find('.chat').length).to.eq(1);
    });

    it('renders a Home button and an End Chat button', () => {
      expect(component.find(Button).length).to.eq(2);
    });

    describe('chat status', () => {
      describe('created', () => {
        it('shows an input', () => {
          expect(component.find('input').length).to.eq(1);
        });
      });

      describe('ended', () => {
        beforeEach(() => {
          component.setState({ status: 'ended' });
        });

        it('does not show an input', () => {
          expect(component.find('input').length).to.eq(0);
        });

        it('does not show an End Chat button', () => {
          expect(component.find(Button).length).to.eq(1);
        });
      });
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
        const fakeEvent = {
          preventDefault: sinon.spy(),
        };

        component.setState({
          chatInput: commonSense,
        });

        component.instance().handleTextSubmit(fakeEvent);

        expect(fakeEvent.preventDefault.called).to.eq(true);
        expect(databaseCall.calledWith(expectedArgs)).to.eq(true);
      });
    });

    describe('#pushChatIdsToFirebase', () => {
      const id = '123';
      let snapshotStub;
      let chatsRefStub;
      let valStub;
      let pushStub;

      beforeEach(() => {
        valStub = sinon.stub().returns(undefined);
        pushStub = sinon.stub();
        snapshotStub = {
          val: valStub,
        };
        chatsRefStub = {
          push: pushStub,
        };
      });

      describe('no chats already', () => {
        it('calls push on chatsRef', () => {
          component.instance().pushChatIdsToFirebase(snapshotStub, chatsRefStub);
          expect(pushStub.calledWith(id)).to.eq(true);
        });
      });

      describe('chat doesnt exist', () => {
        it('calls push on chatsRef', () => {
          valStub.returns({
            key: 'value',
          });
          component.instance().pushChatIdsToFirebase(snapshotStub, chatsRefStub);
          expect(pushStub.calledWith(id)).to.eq(true);
        });
      });

      describe('chat already exists', () => {
        it('does not call push on chatsRef', () => {
          valStub.returns({
            key: 'value',
            another_key: '123',
          });
          component.instance().pushChatIdsToFirebase(snapshotStub, chatsRefStub);
          expect(pushStub.calledWith(id)).to.eq(false);
        });
      });
    });

    describe('End Chat button', () => {
      it('calls #endChat upon click', () => {
        component.find(Button).last().simulate('click');
        expect(fakeDatabase.called).to.eq(true);
      });
    });
  });
});
