import Nightmare from 'nightmare';

import { HOST } from './e2e-admin-constants';

export function getLoggedInState(path) {
  const nightmare = new Nightmare();

  const passwordInputSelector = 'input[type="password"]';
  return nightmare
    // We use this to detect errors in rendering
    .on('page', (type, message, stack) => {
      if (type !== 'error') return;
      throw new Error(`${message}\nstack trace: ${stack}`);
    })
    .goto(`${HOST}${path}`)
    // Wait for the input element to render
    .wait(passwordInputSelector)
    // Write password
    .insert(passwordInputSelector, process.env.CIRCLECI_ADMIN_PASSWORD)
    // Press enter
    .type(passwordInputSelector, '\u000d');
}

export function restartServer() {
  const headerSelector = '#app-header';
  const headerMenuButtonSelector = `${headerSelector}-menu-button`;
  const restartServerButtonSelector = `${headerSelector}-restart-button`;
  const restartServerPasswordInputSelector = '#restart-server-password-input';

  return getLoggedInState('')
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
    .insert(restartServerPasswordInputSelector, process.env.CIRCLECI_ADMIN_PASSWORD)
    // Press enter
    .type(restartServerPasswordInputSelector, '\u000d')
    .wait(() => window.THE_GAZELLE.serverRestartedSuccessfully)
    .end();
}
