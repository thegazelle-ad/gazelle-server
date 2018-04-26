import Nightmare from 'nightmare';

import { NIGHTMARE_CONFIG } from '__tests__/end-to-end/e2e-constants';
import { getLoggedInState } from './e2e-admin-utilities';

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

  it('finds first article', () =>
    getLoggedInState(nightmare, '/articles/page/1')
      .wait(articlesListSelector)
      // We click on the Material UI element where the onClick handler is actually set
      .click(`${articlesListSelector} a:first-child`)
      .wait(articleEditor)
      .path()
      .end()
      .then(path => {
        expect(path).toBe('/articles/page/1/id/150');
      }));

  it('article is published', () =>
    getLoggedInState(nightmare, '/articles/page/1/id/150')
      .wait(articleEditor)
      .evaluate(() => document.querySelector(unpublishTextSelector).innerText)
      .then(text => {
        expect(text).to.include('This article was published on June 04, 2062.');
      }));

  it('unpublish article', () =>
    getLoggedInState(nightmare, '/articles/page/1/id/150')
      .wait(articleEditor)
      .click(unpublishedButtonSelector)
      .wait(articleEditor)
      .path()
      .end()
      .then(path => {
        expect(path).toBe(`/articles/page/1/id/150`);
      }));

  it('article is unpublished', () =>
    getLoggedInState(nightmare, '/articles/page/1/id/150')
      .wait(articleEditor)
      .evaluate(() => document.querySelector(unpublishTextSelector).innerText)
      .then(text => {
        expect(text).to.include(
          'The article has yet to be published. It will be published automatically when you publish the issue that contains it.',
        );
      }));
});
