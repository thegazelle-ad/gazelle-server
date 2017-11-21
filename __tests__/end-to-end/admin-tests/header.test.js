import { getLoggedInState } from './e2e-admin-utilities';

describe('Admin header', () => {
  const headerSelector = '#app-header';

  it('signs out correctly', () => {
    expect.assertions(1);

    const headerMenuButtonSelector = `${headerSelector}-menu-button`;
    const signOutSelector = `${headerSelector}-sign-out-button`;
    const loginPageSelector = '#login-page';
    return getLoggedInState('')
      .wait(headerMenuButtonSelector)
      // mouseup for Material UI quirk
      .mouseup(headerMenuButtonSelector)
      .wait(signOutSelector)
      .click(signOutSelector)
      .wait(loginPageSelector)
      .path()
      .end()
      .then(path => {
        expect(path).toBe('/login');
      });
  });
});
