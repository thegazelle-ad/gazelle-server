/**
 * Since we don't actually server side render on the admin page as it's unnecessary
 * we don't need to test all the pages like we do for the main website as all the server
 * does is just send the client side script anyway.
 */
import Nightmare from 'nightmare';

import { testPathServersideRender } from '__tests__/end-to-end/e2e-utilities';
import { NIGHTMARE_CONFIG } from '__tests__/end-to-end/e2e-constants';
import { HOST } from './e2e-admin-constants';

function testLoginRedirect(nightmare, path) {
  expect.assertions(1);

  let redirectedPath = path;
  if (path === '') {
    redirectedPath = '/';
  }

  return nightmare.goto(`${HOST}${path}`)
    .end()
    .then(result => {
      expect(result.url).toBe(`${HOST}/login?url=${redirectedPath}`);
    });
}

describe('Admin interface server side rendering', () => {
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

  it('renders any page correctly', () => testPathServersideRender(nightmare, HOST, '/login'));

  describe('login redirect', () => {
    it('handles attempting to access main page directly', () => testLoginRedirect(nightmare, ''));
    it(
      'handles attempting to access non-main page directly',
      () => testLoginRedirect(nightmare, '/authors')
    );
  });
});
