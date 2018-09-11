import routes from '../by-number';

jest.enableAutomock();
jest.unmock('../by-number');
jest.unmock('lodash');
jest.unmock('falcor');
jest.unmock('lib/utilities');

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
      addIssue.call({}, [
        { invalidKey: 'something', name: 'someName', issue_number: 3 },
      ]),
    ).rejects.toThrow('Unknown field');
  });

  it("doesn't accept issue with missing required fields", async () => {
    await expect(addIssue.call({}, [{}])).rejects.toThrow('Required field');
  });

  it('accepts valid issue', async () => {
    // We're basically just checking that it doesn't throw an error
    await addIssue.call({}, [{ name: 'someName', issue_number: 3 }]);
  });

  it('accepts optional fields', async () => {
    // We're basically just checking that it doesn't throw an error
    await addIssue.call({}, [
      { name: 'someName', issue_number: 3, published_at: 'someDate' },
    ]);
  });
});
