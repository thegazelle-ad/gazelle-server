import { HOST } from './e2e-admin-constants';
import { ENTER_UNICODE } from '__tests__/end-to-end/e2e-constants';

export function getLoggedInState(nightmare, path) {
  const passwordInputSelector = 'input[type="password"]';
  return nightmare
    // We use this to detect client-side errors in rendering
    .on('page', (type, message, stack) => {
      if (type !== 'error') return;
      throw new Error(`${message}\nstack trace: ${stack}`);
    })
    .goto(`${HOST}${path}`)
    // Wait for the input element to render
    .wait(passwordInputSelector)
    // Write password
    .insert(passwordInputSelector, process.env.CIRCLECI_ADMIN_PASSWORD)
    .type(passwordInputSelector, ENTER_UNICODE);
}

export function restartServer(nightmare) {
  const headerSelector = '#app-header';
  const headerMenuButtonSelector = `${headerSelector}-menu-button`;
  const restartServerButtonSelector = `${headerSelector}-restart-button`;
  const restartServerPasswordInputSelector = '#restart-server-password-input';

  return getLoggedInState(nightmare, '')
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
    .type(restartServerPasswordInputSelector, ENTER_UNICODE)
    .wait(() => window.THE_GAZELLE.serverRestartedSuccessfully)
    .end();
}

export function isVisible(selector, evaluateParent = false) {
  let element = document.querySelector(selector);
  if (evaluateParent) {
    element = element.parentNode;
  }
  return (
    element.style.width !== '0' &&
    element.style.width !== '0px' &&
    element.style.height !== '0' &&
    element.style.height !== '0px' &&
    element.style.display !== 'none'
  );
}
