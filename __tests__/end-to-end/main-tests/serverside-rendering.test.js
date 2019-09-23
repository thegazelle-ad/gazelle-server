import Nightmare from 'nightmare';

import { testPathServersideRender } from '__tests__/end-to-end/e2e-utilities';
import { NIGHTMARE_CONFIG } from '__tests__/end-to-end/e2e-constants';
import { HOST } from './e2e-gazelle-constants';

describe('The Gazelle server side rendering', () => {
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

  it('renders front page correctly', () =>
    testPathServersideRender(nightmare, HOST, ''));
  it('renders archive page correctly', () =>
    testPathServersideRender(nightmare, HOST, '/archives'));
  it('renders about page correctly', () =>
    testPathServersideRender(nightmare, HOST, '/about'));
  it('renders code of ethics page correctly', () =>
    testPathServersideRender(nightmare, HOST, '/ethics'));
  it('renders category page correctly', () =>
    testPathServersideRender(nightmare, HOST, '/category/news'));
  it('renders team page correctly', () =>
    testPathServersideRender(nightmare, HOST, '/category/team'));
  it('renders non-default issue page correctly', () =>
    testPathServersideRender(nightmare, HOST, '/issue/100'));
  it('renders search page correctly', () =>
    testPathServersideRender(nightmare, HOST, '/search?q=title-1'));
  it('renders article page correctly', () =>
    testPathServersideRender(nightmare, HOST, '/issue/1/news/slug-1'));
  it('renders staff member page correctly', () =>
    testPathServersideRender(nightmare, HOST, '/staff-member/staff1'));
  // This should definitely return a 404 but it isn't implemented right now so we'll make it a todo
  it('renders not found page correctly', () =>
    testPathServersideRender(
      nightmare,
      HOST,
      '/this/path/should/not/exist',
      200,
    ));
});
