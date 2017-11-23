import { isVisible } from '__tests__/end-to-end/e2e-utilities';
import { SIMPLE_TEST_TIMEOUT } from '__tests__/end-to-end/e2e-constants';
import { getLoggedInState, restartServer } from './e2e-admin-utilities';

jest.setTimeout(SIMPLE_TEST_TIMEOUT);

describe('Admin interface author list', () => {
  const authorListSelector = '#author-list';
  const getTabButtonSelector = index => (
    `${authorListSelector} button[type="button"]:nth-child(${index})`
  );
  const addNewTabSelector = '#author-list-add-new-tab';
  const editTabSelector = '#author-list-edit-tab';
  const authorEditorSelector = '#author-editor';
  const searchInputSelector = `${authorListSelector} .search-bar-authors input[type="text"]`;
  // This should return the first one, and we also currently search in a way so that there
  // should always only be one result
  const searchItemSelector = `${authorListSelector} .search-bar-authors .search-bar-result`;

  it('searches correctly for authors', () => {
    expect.assertions(1);

    return getLoggedInState('/authors')
      .wait(searchInputSelector)
      .insert(searchInputSelector, 'Emil Goldsmith Olesen')
      .wait(searchItemSelector)
      // We click on the Material UI element where the onClick handler is actually set
      .click(`${searchItemSelector} span[role="menuitem"]`)
      .wait(authorEditorSelector)
      .path()
      .end()
      .then((path) => {
        expect(path).toBe('/authors/emil-goldsmith-olesen');
      });
  });

  it('correctly switches tabs', () => (
    getLoggedInState('/authors')
      .wait(authorListSelector)
      // Click 'Add New' tab
      .click(getTabButtonSelector(2))
      .wait(addNewTabSelector)
      // Click 'Edit' tab
      .click(getTabButtonSelector(1))
      .wait(editTabSelector)
      // The waits make sure we actually routed to the right elements
      // so no further checks are needed
      .end()
  ));

  it('correctly adds new authors', () => {
    expect.assertions(2);

    // We first create a new author with a unique name
    const authorName = `test-user-${new Date().getTime()}`;
    const getInputSelector = index => `${addNewTabSelector} form div:nth-of-type(${index}) input`;
    const createAuthorSelector = `${addNewTabSelector} button[type="submit"]`;
    return getLoggedInState('/authors')
      .wait(authorListSelector)
      // Click 'Add New' tab
      // We use mouseup here because of weird Material UI behaviour with the touchtap event it uses
      // we should be able to change this to click when Material UI 1.0 is released
      .mouseup(getTabButtonSelector(2))
      // We use isVisible here as opposed to wait because Material UI doesn't actually remove
      // the other tab from the DOM tree, but instead makes them invisible by setting height=0px.
      // The true flag indicates checking the parent element as our selector is to the child of
      // the main tab div Material UI hides
      .wait(isVisible, addNewTabSelector, true)
      // Input name
      .insert(getInputSelector(1), authorName)
      // Input slug
      .insert(getInputSelector(2), authorName.substr(0, authorName.length - 1))
      // We type the last character to fire the events to enable the create author button
      .type(getInputSelector(2), authorName.substr(authorName.length - 1, 1))
      .click(createAuthorSelector)
      .wait(authorEditorSelector)
      .path()
      .end()
      .then(path => {
        expect(path).toBe(`/authors/${authorName}`);
        // This returns a promise so we won't do anything else until the server is done restarting
        return restartServer();
      })
      .then(() => (
        // We have restarted the server which also clears the cache so this is also a test that
        // the data we inserted actually propagated to the database
        getLoggedInState('/authors')
          .wait(searchInputSelector)
          .insert(searchInputSelector, authorName)
          .wait(searchItemSelector)
          // We click on the Material UI element where the onClick handler is actually set
          .click(`${searchItemSelector} span[role="menuitem"]`)
          .wait(authorEditorSelector)
          .path()
          .end()
          .then((path) => {
            expect(path).toBe(`/authors/${authorName}`);
          })
      ));
  });
});
