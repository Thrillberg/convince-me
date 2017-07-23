import { Button } from 'react-bootstrap';
import Matchmaker from '../Matchmaker';
import ChatList from '../ChatList';

describe('Matchmaker', () => {
  let component;
  let fakeAuthenticated;
  let fakeDatabase;
  let history;

  beforeEach(() => {
    fakeAuthenticated = sinon.stub(Firebase, 'auth').returns({
      currentUser: {
        uid: '123',
      },
    });

    fakeDatabase = sinon.stub(Firebase, 'database').returns({
      ref: sinon.stub().returns({
        orderByKey: sinon.stub().returns({
          equalTo: sinon.stub().returns({
            once: sinon.stub().returns({
              then: sinon.spy(),
            }),
          }),
        }),
        once: sinon.stub(Firebase, 'once').returns({
          then: sinon.stub(),
        }),
        set: sinon.stub(Firebase, 'set'),
        push: sinon.stub().returns({
          key: 'some key',
        }),
      }),
      ServerValue: sinon.spy(),
    });

    history = {
      push: sinon.spy(),
    };

    component = shallow(<Matchmaker history={history} />);
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
        modalOpen: false,
        modalLink: '',
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
          modalOpen: false,
          modalLink: '',
        });

        component.instance().setChatsToState();

        expect(databaseCall.calledWith('value')).to.eq(true);
      });
    });
  });

  describe('layout', () => {
    it('has a Chat Now and Modal button', () => {
      expect(component.find(Button).length).to.eq(2);
    });

    it('has a list of current chats', () => {
      expect(component.find(ChatList).length).to.eq(1);
    });
  });

  describe('interaction', () => {
    describe('#prepareGetWaitingChat', () => {
      it('calls Firebase', () => {
        const databaseCall = fakeDatabase().ref().once;
        component.instance().prepareGetWaitingChat();
        expect(databaseCall.called).to.eq(true);
      });
    });

    describe('#getWaitingChat', () => {
      let snapshotStub;
      let expectedArgs;

      describe('when there is a snapshot value', () => {
        describe('when there are valid chats', () => {
          let validChat;

          beforeEach(() => {
            validChat = {
              stuff: {
                thing: 'content',
                status: 'created',
              },
            };
            snapshotStub = {
              val: sinon.stub().returns(validChat),
            };
          });

          it('redirects to chat', () => {
            component.instance().getWaitingChat(snapshotStub);
            expect(component.instance().props.history.push.called).to.eq(true);
          });
        });

        describe('when there are no valid chats', () => {
          let invalidChat;

          beforeEach(() => {
            invalidChat = {
              stuff: {
                thing: 'content',
                status: 'ended',
              },
            };
            snapshotStub = {
              val: sinon.stub().returns(invalidChat),
            };
            expectedArgs = [[{
              users: [fakeAuthenticated().currentUser.uid],
              started_at: Firebase.database.ServerValue.TIMESTAMP,
              status: 'created',
            }]];
          });

          it('saves and redirects to chat', () => {
            component.instance().getWaitingChat(snapshotStub);
            expect(fakeDatabase().ref().push.args).to.deep.eq(expectedArgs);
            expect(component.instance().props.history.push.called).to.eq(true);
          });
        });
      });

      describe('when there is not a snapshot value', () => {
        beforeEach(() => {
          snapshotStub = {
            val: sinon.stub().returns(null),
          };
        });

        it('saves and redirects to chat', () => {
          component.instance().getWaitingChat(snapshotStub);
          expect(component.instance().props.history.push.called).to.eq(true);
        });
      });
    });

    describe('#redirectToChat', () => {
      describe('when there is a chat id', () => {
        it('calls once on Firebase', () => {
          const chatId = '123';
          const databaseCall = fakeDatabase().ref().once;
          component.instance().redirectToChat(chatId);
          expect(databaseCall.called).to.eq(true);
          expect(component.instance().props.history.push.called).to.eq(true);
        });
      });

      describe('when there is no chat id', () => {
        it('calls push on Firebase', () => {
          const databaseCall = fakeDatabase().ref().push;
          component.instance().redirectToChat();
          expect(databaseCall.called).to.eq(true);
          expect(component.instance().props.history.push.called).to.eq(true);
        });
      });
    });

    describe('#setChatToStarted', () => {
      let snapshot;
      let chat;
      let databaseCall;

      describe('there is one user', () => {
        beforeEach(() => {
          snapshot = {
            val: sinon.stub().returns({
              users: ['user'],
            }),
          };
          chat = '123';
          databaseCall = fakeDatabase().ref().set;
        });

        afterEach(() => {
          databaseCall.restore();
        });

        it('resets the window location', () => {
          const push = component.instance().props.history.push;
          component.instance().setChatToStarted(snapshot, chat);
          expect(push.calledWith('/chats/123')).to.eq(true);
        });

        it('calls Firebase', () => {
          component.instance().setChatToStarted(snapshot, chat);
          expect(databaseCall.called).to.eq(true);
        });
      });

      describe('there is not one user', () => {
        beforeEach(() => {
          snapshot = {
            val: sinon.stub().returns({
              users: [],
            }),
          };
          chat = '123';
          databaseCall = fakeDatabase().ref().set;
        });

        afterEach(() => {
          databaseCall.restore();
        });

        it('resets the window location', () => {
          const push = component.instance().props.history.push;
          component.instance().setChatToStarted(snapshot, chat);
          expect(push.calledWith('/chats/123'));
        });

        it('does not call Firebase', () => {
          component.instance().setChatToStarted(snapshot, chat);
          expect(databaseCall.called).to.eq(false);
        });
      });
    });
  });
});
