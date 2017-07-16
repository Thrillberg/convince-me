import App from '../App';

describe('App', () => {
  let fakeAuthenticated;
  let component;

  describe('authenticated', () => {
    beforeEach(() => {
      fakeAuthenticated = sinon.stub(Firebase, 'auth').returns({
        currentUser: true,
      });

      component = shallow(<App children={[]} />);
    });

    afterEach(() => {
      fakeAuthenticated.restore();
    });

    it('renders a children div', () => {
      expect(component.find('div').length).to.equal(1);
    });
  });

  describe('unauthenticated', () => {
    beforeEach(() => {
      fakeAuthenticated = sinon.stub(Firebase, 'auth').returns({
        currentUser: false,
      });

      component = shallow(<App children={[]} />);
    });

    afterEach(() => {
      fakeAuthenticated.restore();
    });

    it('renders null', () => {
      expect(component.find('div').length).to.equal(0);
    });
  });
});
