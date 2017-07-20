import App from '../App';

describe('App', () => {
  let fakeAuthenticated;
  let component;
  let onAuthStateChangedStub;
  let signInAnonymouslyStub;

  describe('authenticated', () => {
    beforeEach(() => {
      onAuthStateChangedStub = sinon.spy();

      fakeAuthenticated = sinon.stub(Firebase, 'auth').returns({
        currentUser: true,
        onAuthStateChanged: onAuthStateChangedStub,
      });

      component = mount(<App children={[]} />);
    });

    afterEach(() => {
      fakeAuthenticated.restore();
    });

    it('renders a children div', () => {
      expect(component.find('div').length).to.equal(5);
      expect(component.state()).to.deep.eq({
        user: null,
      });
    });

    it('calls onAuthStateChanged', () => {
      expect(fakeAuthenticated().onAuthStateChanged.called).to.eq(true);
    });
  });

  describe('unauthenticated', () => {
    beforeEach(() => {
      signInAnonymouslyStub = sinon.stub().returns({
        catch: sinon.spy(),
      });

      onAuthStateChangedStub = sinon.spy();

      fakeAuthenticated = sinon.stub(Firebase, 'auth').returns({
        currentUser: false,
        signInAnonymously: signInAnonymouslyStub,
        onAuthStateChanged: onAuthStateChangedStub,
      });

      component = mount(<App children={[]} />);
    });

    afterEach(() => {
      fakeAuthenticated.restore();
    });

    it('renders null', () => {
      expect(component.find('div').length).to.equal(0);
      expect(component.state()).to.deep.eq({
        user: null,
      });
    });

    it('calls signInAnonymously and onAuthStateChanged', () => {
      expect(signInAnonymouslyStub.called).to.eq(true);
      expect(fakeAuthenticated().onAuthStateChanged.called).to.eq(true);
    });
  });
});
