import { Button } from 'react-bootstrap';
import Matchmaker from '../Matchmaker';
import ChatList from '../ChatList';

describe('Matchmaker', () => {
  let component;
  let fakeDatabase;
  let historyStub;

  beforeEach(() => {
    fakeDatabase = sinon.stub(Firebase, 'database').returns({
      ref: sinon.stub().returns({
        once: sinon.stub(Firebase, 'once').returns({
          then: sinon.stub(),
        }),
        set: sinon.stub(Firebase, 'set'),
      }),
    });

    historyStub = {
      push: sinon.stub(),
    };

    component = shallow(<Matchmaker history={historyStub} />);
  });

  afterEach(() => {
    fakeDatabase.restore();
  });

  describe('layout', () => {
    it('has a Chat Now button', () => {
      expect(component.find(Button).length).to.eq(1);
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
      let callbackStub;

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
            callbackStub = sinon.spy();
          });

          it('calls the callback with the valid chats', () => {
            const chatCall = Object.keys(validChat)[0];
            component.instance().getWaitingChat(snapshotStub, callbackStub);
            expect(callbackStub.calledWith(chatCall)).to.eq(true);
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
            callbackStub = sinon.spy();
          });

          it('calls the callback without an argument', () => {
            component.instance().getWaitingChat(snapshotStub, callbackStub);
            expect(callbackStub.called).to.eq(true);
          });
        });
      });

      describe('when there is not a snapshot value', () => {
        beforeEach(() => {
          snapshotStub = {
            val: sinon.stub().returns(null),
          };
          callbackStub = sinon.spy();
        });

        it('calls the callback without an argument', () => {
          component.instance().getWaitingChat(snapshotStub, callbackStub);
          expect(callbackStub.called).to.eq(true);
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
        });
      });

      describe('when there is no chat id', () => {
        it('calls set on Firebase', () => {
          const databaseCall = fakeDatabase().ref().set;
          component.instance().redirectToChat();
          expect(databaseCall.called).to.eq(true);
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
