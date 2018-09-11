import routes from '../by-number';

jest.enableAutomock();
jest.unmock('../by-number');
jest.unmock('lodash');
jest.unmock('falcor');

// Mock the db addIssue call
jest.mock('lib/db', () => ({
  addIssue: async () => true,
}));

const addIssuePath = "issues['byNumber']['addIssue']";
const addIssue = routes.find(x => x.route === addIssuePath);

expect(addIssue).not.toBeUndefined();

describe('issuesByNumber falcor routes', () => {
  it("doesn't accept invalid keys", async () => {
    await expect(
      addIssue.call({}, [{ invalidKey: 'something' }]),
    ).rejects.toThrow();
  });

  it('accepts valid issue', async () => {
    // We're basically just checking that it doesn't throw an error
    await addIssue.call({}, [{ name: 'someName', issue_order: 3 }]);
  });
});
