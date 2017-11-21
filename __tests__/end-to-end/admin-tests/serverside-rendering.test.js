/**
 * Since we don't actually server side render on the admin page as it's unnecessary
 * we don't need to test all the pages like we do for the main website as all the server
 * does is just send the client side script anyway.
 */
import Nightmare from 'nightmare';

import { testPathServersideRender } from '__tests__/end-to-end/e2e-utilities';
import { SIMPLE_TEST_TIMEOUT } from '__tests__/end-to-end/e2e-constants';
import { HOST } from './e2e-admin-constants';

jest.setTimeout(SIMPLE_TEST_TIMEOUT);

describe('Admin interface server side rendering', () => {
  testPathServersideRender(HOST, '/login', 'any');

  it('correctly redirects to the login page', () => {
    const nightmare1 = new Nightmare();

    expect.assertions(2);

    const allPromises = [];

    allPromises.push(
      nightmare1.goto(`${HOST}`)
      .end()
      .then(result => {
        expect(result.url).toBe(`${HOST}/login?url=/`);
      })
    );

    const nightmare2 = new Nightmare();

    allPromises.push(
      nightmare2.goto(`${HOST}/authors`)
      .end()
      .then(result => {
        expect(result.url).toBe(`${HOST}/login?url=/authors`);
      })
    );

    return Promise.all(allPromises);
  });
});
