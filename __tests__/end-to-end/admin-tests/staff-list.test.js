import Nightmare from 'nightmare';

import {
  NIGHTMARE_CONFIG,
  ENTER_UNICODE,
} from '__tests__/end-to-end/e2e-constants';
import {
  getLoggedInState,
  restartServer,
  isVisible,
} from './e2e-admin-utilities';

describe('Admin interface staff member list', () => {
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

  const staffListSelector = '#staff-list';
  const getTabButtonSelector = index =>
    `${staffListSelector} button[type="button"]:nth-child(${index})`;
  const addNewTabSelector = '#staff-list-add-new-tab';
  const editTabSelector = '#staff-list-edit-tab';
  const staffEditorSelector = '#staff-editor';
  const searchInputSelector = `${staffListSelector} .search-bar-staff input[type="text"]`;
  // This should return the first one, and we also currently search in a way so that there
  // should always only be one result
  const searchItemSelector = `${staffListSelector} .search-bar-staff .search-bar-result`;

  it('searches correctly for staff', () => {
    expect.assertions(1);

    return (
      getLoggedInState(nightmare, '/staff')
        .wait(searchInputSelector)
        .insert(searchInputSelector, 'firstname1 lastname1')
        .wait(searchItemSelector)
        // We click on the Material UI element where the onClick handler is actually set
        .click(`${searchItemSelector} span[role="menuitem"]`)
        .wait(staffEditorSelector)
        .path()
        .end()
        .then(path => {
          expect(path).toBe('/staff/staff1');
        })
    );
  });

  it('handles gibberish search', () =>
    getLoggedInState(nightmare, '/staff')
      .wait(searchInputSelector)
      // We first make sure there are actual results present so we can check for the difference
      .insert(searchInputSelector, 'firstname1 lastname1')
      .wait(searchItemSelector)
      // We know insert gibberish that shouldn't give any results
      .insert(searchInputSelector, 'Not the name of a staff member')
      .wait(
        selector => document.querySelector(selector) === null,
        searchItemSelector,
      )
      .end());

  it('correctly switches tabs', () =>
    getLoggedInState(nightmare, '/staff')
      .wait(staffListSelector)
      // Click 'Add New' tab
      .click(getTabButtonSelector(2))
      .wait(addNewTabSelector)
      // Click 'Edit' tab
      .click(getTabButtonSelector(1))
      .wait(editTabSelector)
      // The waits make sure we actually routed to the right elements
      // so no further checks are needed
      .end());

  const testAddingNewStaff = (useEnter = false, inputToPressEnterOn = 1) => {
    expect.assertions(2);

    // We first create a new staff member with a unique name
    const staffName = `test-user-${new Date().getTime()}`;
    const getInputSelector = index =>
      `${addNewTabSelector} form div:nth-of-type(${index}) input`;
    const createStaffSelector = `${addNewTabSelector} button[type="submit"]`;
    const staffInformationEntered = getLoggedInState(nightmare, '/staff')
      .wait(staffListSelector)
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
      .insert(getInputSelector(1), staffName)
      // Input slug
      .insert(getInputSelector(2), staffName.substr(0, staffName.length - 1))
      // We type the last character to fire the events to enable the create staff member button
      .type(getInputSelector(2), staffName.substr(staffName.length - 1, 1));

    let staffInformationSubmitted;
    if (useEnter) {
      staffInformationSubmitted = staffInformationEntered.type(
        getInputSelector(inputToPressEnterOn),
        ENTER_UNICODE,
      );
    } else {
      staffInformationSubmitted = staffInformationEntered.click(
        createStaffSelector,
      );
    }

    return staffInformationSubmitted
      .wait(staffEditorSelector)
      .path()
      .end()
      .then(path => {
        expect(path).toBe(`/staff/${staffName}`);
        // We reuse the variable since we know .then only runs because there were no exceptions
        // so .end() has finished successfully, and also this means that the afterEach function will
        // correctly terminate the nightmare instance if an error happens in this step
        nightmare = new Nightmare(NIGHTMARE_CONFIG);
        // This returns a promise so we won't do anything else until the server is done restarting
        return restartServer(nightmare);
      })
      .then(() => {
        // We reuse the variable since we know .then only runs because there were no exceptions
        // so .end() has finished successfully, and also this means that the afterEach function will
        // correctly terminate the nightmare instance if an error happens in this step
        nightmare = new Nightmare(NIGHTMARE_CONFIG);
        // We have restarted the server which also clears the cache which allows us to test that
        // the data we inserted actually propagated to the database
        return (
          getLoggedInState(nightmare, '/staff')
            .wait(searchInputSelector)
            .insert(searchInputSelector, staffName)
            .wait(searchItemSelector)
            // We click on the Material UI element where the onClick handler is actually set
            .click(`${searchItemSelector} span[role="menuitem"]`)
            .wait(staffEditorSelector)
            .path()
            .end()
            .then(path => {
              expect(path).toBe(`/staff/${staffName}`);
            })
        );
      });
  };

  it('correctly adds new staff member using button', () =>
    testAddingNewStaff());
  it('correctly adds new staff member using enter on name', () =>
    testAddingNewStaff(true, 1));
  it('correctly adds new staff member using enter on slug', () =>
    testAddingNewStaff(true, 2));
});
