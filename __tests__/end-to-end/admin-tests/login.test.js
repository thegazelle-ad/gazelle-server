import Nightmare from 'nightmare';

import {
  SIMPLE_TEST_TIMEOUT,
  NIGHTMARE_CONFIG,
  ENTER_UNICODE,
} from '__tests__/end-to-end/e2e-constants';
import { HOST } from './e2e-admin-constants';

jest.setTimeout(SIMPLE_TEST_TIMEOUT);

function testLoginRedirect(nightmare, path, useButton = false) {
  const passwordInputSelector = 'input[type="password"]';
  const passwordSubmitSelector = 'button[type="submit"]';
  // The default is because the '/' path actually also redirects to '/articles/page/1'
  const redirectedPath = !path || path === '/login' ? '/articles/page/1' : path;

  const passwordEnteredState =
    nightmare
    // We use this to detect client-side errors in rendering
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
    passwordSubmittedState = passwordEnteredState.click(passwordSubmitSelector);
  } else {
    passwordSubmittedState = passwordEnteredState.type(passwordInputSelector, ENTER_UNICODE);
  }

  return passwordSubmittedState
    // Wait until we've rendered the target page
    .wait(expectedEndPath => window.location.pathname === expectedEndPath, redirectedPath)
    .end();
}

describe('Admin login', () => {
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

  it(
    'handles redirect after direct access to /login',
    () => testLoginRedirect(nightmare, '/login')
  );
  it(
    'redirects correctly to front page',
    () => testLoginRedirect(nightmare, '')
  );
  it(
    'redirects correctly to non-front page',
    () => testLoginRedirect(nightmare, '/authors')
  );
  // Until now we only submitted by enter so we also check that submitting with button works
  it(
    'login works with using button',
    () => testLoginRedirect(nightmare, '', true)
  );
});
