import Nightmare from 'nightmare';

import { NIGHTMARE_CONFIG } from '__tests__/end-to-end/e2e-constants';
import { getLoggedInState, restartServer } from './e2e-admin-utilities';

describe('can unpublish article', () => {
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

  const articlesListSelector = '#articles-list';
  const articleEditor = '#article-editor';
  const unpublishTextSelector = '#unpublished-text';
  const unpublishedButtonSelector = '#unpublished-button';

  const expectedArticlePath = '/articles/id/200';

  it('finds first article', () =>
    getLoggedInState(nightmare, '/articles/page/0')
      .wait(articlesListSelector)
      // We click on the Material UI element where the onClick handler is actually set
      .click(`${articlesListSelector} a`)
      .wait(articleEditor)
      .path()
      .end()
      .then(path => {
        expect(path).toBe(expectedArticlePath);
      }));

  it('is article published', () =>
    getLoggedInState(nightmare, expectedArticlePath)
      .wait(articleEditor)
      .evaluate(
        sel => document.querySelector(sel).innerText,
        unpublishTextSelector,
      )
      .then(text => {
        expect(text).toMatchSnapshot();
      }));

  it('unpublishes article', () =>
    getLoggedInState(nightmare, expectedArticlePath)
      .wait(articleEditor)
      .click(unpublishedButtonSelector)
      .wait(articleEditor)
      .path()
      .end()
      .then(path => {
        expect(path).toBe(expectedArticlePath);
        nightmare = new Nightmare(NIGHTMARE_CONFIG);
        return restartServer(nightmare);
      }));

  it('is article unpublished', () =>
    getLoggedInState(nightmare, expectedArticlePath)
      .wait(articleEditor)
      .evaluate(
        sel => document.querySelector(sel).innerText,
        unpublishTextSelector,
      )
      .then(text => {
        expect(text).toMatchSnapshot();
      }));
});
