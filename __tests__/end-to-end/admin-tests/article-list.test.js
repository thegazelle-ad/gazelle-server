import Nightmare from 'nightmare';

import {
  SIMPLE_TEST_TIMEOUT,
  NIGHTMARE_CONFIG,
} from '__tests__/end-to-end/e2e-constants';
import { getLoggedInState } from './e2e-admin-utilities';

jest.setTimeout(SIMPLE_TEST_TIMEOUT);

describe('Admin interface article list', () => {
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

  const articleListSelector = '#article-list';
  const getTabButtonSelector = index => (
    `${articleListSelector} button[type="button"]:nth-child(${index})`
  );
  const articleEditorSelector = '#article-editor';
  const searchInputSelector = `${articleListSelector} .search-bar-articles input[type="text"]`;
  // This should return the first one, and we also currently search in a way so that there
  // should always only be one result
  const searchItemSelector = `${articleListSelector} .search-bar-articles .search-bar-result`;
  const nextPageSelector = '#article-next-page-tab';
  const prevPageSelector = '#article-prev-page-tab';
  it('searches correctly for articles', () => {
    expect.assertions(1);

    return getLoggedInState(nightmare, '/articles')
      .wait(searchInputSelector)
      .insert(searchInputSelector, 'News of the Week')
      .wait(searchItemSelector)
      // We click on the Material UI element where the onClick handler is actually set
      .click(`${searchItemSelector} span[role="menuitem"]`)
      .wait(articleEditorSelector)
      .path()
      .end()
      .then((path) => {
        expect(path).toBe('/articles/page/1/slug/news-of-the-week-29');
      });
  });

  it('correctly moves to the next and prev page in article list', () => (
    getLoggedInState(nightmare, '/articles')
      .wait(articleListSelector)
      // Click 'Add New' tab
      .click(getTabButtonSelector(1))
      .wait(nextPageSelector)
      // Click 'Edit' tab
      .click(getTabButtonSelector(2))
      .wait(prevPageSelector)
      // The waits make sure we actually routed to the right elements
      // so no further checks are needed
      .end()
  ));
});
