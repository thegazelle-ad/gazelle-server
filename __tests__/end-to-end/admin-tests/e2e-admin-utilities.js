import { HOST } from './e2e-admin-constants';
import { ENTER_UNICODE } from '__tests__/end-to-end/e2e-constants';

export function getLoggedInState(nightmare, path) {
  const googleLoginSelector = 'div.abcRioButtonContentWrapper';
  return (
    nightmare
      // We use this to detect client-side errors in rendering
      .on('page', (type, message, stack) => {
        if (type !== 'error') return;
        throw new Error(`${message}\nstack trace: ${stack}`);
      })
      .goto(`${HOST}${path}`)
      // Wait for the google login button to render
      .wait(googleLoginSelector)
      .click(googleLoginSelector)
  );
}

export function checkValueOfAlert(expectedAlert) {
  const alertTextDiv = document.getElementById('modal-alert-text');
  return alertTextDiv && alertTextDiv.innerHTML === expectedAlert;
}

export function restartServer(nightmare) {
  const headerSelector = '#app-header';
  const headerMenuButtonSelector = `${headerSelector}-menu-button`;
  const restartServerButtonSelector = `${headerSelector}-restart-button`;
  const restartServerPasswordInputSelector = '#restart-server-password-input';

  return (
    getLoggedInState(nightmare, '')
      .wait(headerMenuButtonSelector)
      // mouseup for Material UI quirk
      .mouseup(headerMenuButtonSelector)
      .wait(restartServerButtonSelector)
      .click(restartServerButtonSelector)
      .wait(restartServerPasswordInputSelector)
      // Insert restart server password
      .insert(
        restartServerPasswordInputSelector,
        process.env.CIRCLECI_ADMIN_PASSWORD,
      )
      .type(restartServerPasswordInputSelector, ENTER_UNICODE)
      .wait(checkValueOfAlert, 'Server restarted successfully')
      .end()
  );
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
