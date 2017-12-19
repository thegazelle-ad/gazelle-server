import Nightmare from 'nightmare';

import { getLoggedInState } from './e2e-admin-utilities';
import {
  NIGHTMARE_CONFIG,
  ENTER_UNICODE,
} from '__tests__/end-to-end/e2e-constants';

describe('Admin header', () => {
  let nightmare = null;
  beforeEach(() => {
    nightmare = new Nightmare(NIGHTMARE_CONFIG);
  });

  afterEach(() => {
    // Kill the nightmare instance, this won't make a difference if everything worked as expected
    // but if we don't have it when something doesn't go as unexpected it can make jest hang
    // and not terminate
    nightmare.halt();
  });

  const headerSelector = '#app-header';

  it('signs out correctly', () => {
    expect.assertions(1);

    const headerMenuButtonSelector = `${headerSelector}-menu-button`;
    const signOutSelector = `${headerSelector}-sign-out-button`;
    const loginPageSelector = '#login-page';
    return getLoggedInState(nightmare, '')
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

  describe('restarting server', () => {
    const headerMenuButtonSelector = `${headerSelector}-menu-button`;
    const restartServerButtonSelector = `${headerSelector}-restart-button`;
    const restartServerPasswordInputSelector = '#restart-server-password-input';
    const restartServerSubmitSelector = '#restart-server-password-submit';
    const restartServerCancelSelector = '#restart-server-password-cancel';

    const testRestartServer = (useEnter = false, initialWrongPassword = false) => {
      const passwordInsertedState = getLoggedInState(nightmare, '')
        // We inject a script that sets window.THE_GAZELLE.serverRestartedSuccessfully = true when
        // the correct `window.alert` call has been made
        .inject('js', `${__dirname}/assets/checkServerRestarted.js`)
        .wait(headerMenuButtonSelector)
        // mouseup for Material UI quirk
        .mouseup(headerMenuButtonSelector)
        .wait(restartServerButtonSelector)
        .click(restartServerButtonSelector)
        .wait(restartServerPasswordInputSelector)
        // Insert restart server password
        .insert(restartServerPasswordInputSelector, process.env.CIRCLECI_ADMIN_PASSWORD);

      let passwordSubmittedState;
      if (initialWrongPassword) {
        // Add an extra letter to invalidate password, submit it, then submit correct
        passwordSubmittedState = passwordInsertedState
          .insert(restartServerPasswordInputSelector, 'a')
          .type(restartServerPasswordInputSelector, ENTER_UNICODE)
          // TODO: When we change from the ugly window.alert to a proper banner then check that
          // the 'invalid password' message shows,
          // it's too much of a hassle testing it before that.
          .insert(restartServerPasswordInputSelector, process.env.CIRCLECI_ADMIN_PASSWORD)
          .type(restartServerPasswordInputSelector, ENTER_UNICODE);
      } else if (useEnter) {
        passwordSubmittedState = passwordInsertedState
          .type(restartServerPasswordInputSelector, ENTER_UNICODE);
      } else {
        passwordSubmittedState = passwordInsertedState.click(restartServerSubmitSelector);
      }

      return passwordSubmittedState
        .wait(() => window.THE_GAZELLE.serverRestartedSuccessfully)
        .end();
    };

    it('works with pressing enter', () => testRestartServer(true));
    it('works with pressing submit', () => testRestartServer(false));
    it('works with an initial invalid password', () => testRestartServer(false, true));

    it('works pressing cancel in modal', () => (
      getLoggedInState(nightmare, '')
        // We inject a script that sets window.THE_GAZELLE.serverRestartedSuccessfully = true when
        // the correct `window.alert` call has been made
        .inject('js', `${__dirname}/assets/checkServerRestarted.js`)
        .wait(headerMenuButtonSelector)
        // mouseup for Material UI quirk
        .mouseup(headerMenuButtonSelector)
        .wait(restartServerButtonSelector)
        .click(restartServerButtonSelector)
        .wait(restartServerCancelSelector)
        .click(restartServerCancelSelector)
        // Make sure modal dissappears
        .wait(
          (selector) => document.querySelector(selector) === null,
          restartServerCancelSelector
        )
        .end()
    ));
  });
});
