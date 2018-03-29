import Nightmare from 'nightmare';

import { NIGHTMARE_CONFIG } from '__tests__/end-to-end/e2e-constants';
import { getLoggedInState } from './e2e-admin-utilities';

describe('Not Found Page', () => {
  let nightmare = null;

  afterEach(() => {
    // kill the nightmare instance
    nightmare.halt();
  });

  it('renders not-found page for wildcard route', () => {
    nightmare = new Nightmare(NIGHTMARE_CONFIG);
    const notFoundPageSelector = '#not-found-page';

    return getLoggedInState(nightmare, '/not/a/valid/route')
      .wait(notFoundPageSelector)
      .end();
  });
});
