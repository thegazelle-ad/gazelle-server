import Nightmare from 'nightmare';

import { SIMPLE_TEST_TIMEOUT } from '__tests__/end-to-end/e2e-constants';
import { HOST } from './e2e-admin-constants';

jest.setTimeout(SIMPLE_TEST_TIMEOUT);

function testLoginRedirect(path, name, useButton = false) {
  const nightmare = new Nightmare();

  it(name, () => {
    const passwordInputSelector = 'input[type="password"]';
    // The default is because the '/' path actually also redirects to '/articles/page/1'
    const redirectedPath = !path || path === '/login' ? '/articles/page/1' : path;

    const passwordEnteredState =
      nightmare
      // We use this to detect errors in rendering
      .on('page', (type, message, stack) => {
        if (type !== 'error') return;
        throw new Error(`${message}\nstack trace: ${stack}`);
      })
      .goto(`${HOST}${path}`)
      // Wait for the input element to render
      .wait(passwordInputSelector)
      // Write password
      .insert(passwordInputSelector, process.env.CIRCLECI_ADMIN_PASSWORD);

    let passwordSubmittedState;
    if (useButton) {
      passwordSubmittedState = passwordEnteredState.click('button[type="submit"]');
    } else {
      // Press enter
      passwordSubmittedState = passwordEnteredState.type(passwordInputSelector, '\u000d');
    }

    return passwordSubmittedState
      // Wait until we've rendered the authors page
      .wait(expectedEndPath => window.location.pathname === expectedEndPath, redirectedPath)
      .end();
  });
}

describe('Admin login', () => {
  testLoginRedirect('/login', 'handles redirect after direct access to /login');
  testLoginRedirect('', 'redirects correctly to front page');
  testLoginRedirect('/authors', 'redirects correctly to non-front page');
  // Until now we only submitted by enter so we also check that submitting with button works
  testLoginRedirect('', 'login works with using button', true);
});
