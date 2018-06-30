/**
 * This test is incomplete, more should without a doubt be added to complete all cases
 */
import { validateChanges } from '../articleLogic';

describe('validateChanges', () => {
  it('catches deleting all authors', async () => {
    const articleId = 1;
    const mockState = buildMockState(articleId);
    const validationResult = await validateChanges(
      articleId,
      mockState,
      () => undefined,
    );
    expect(validationResult.invalid).toBe(true);
    expect(validationResult.msg).toMatch(
      "we currently don't have deleting every single author implemented",
    );
  });
});

/**
 * I imagine that this function when a proper test is written will
 * build a default mock with overrides being able to be passed in through
 * the falcorData and formData fields
 * @param {number} articleId
 * @param {any} falcorData
 * @param {any} formData
 * @returns {any}
 */
// eslint-disable-next-line no-unused-vars
function buildMockState(articleId, falcorData = {}, formData = {}) {
  return {
    data: {
      articles: {
        byId: {
          [articleId]: {
            authors: [
              {
                id: 1,
              },
              {
                id: 2,
              },
            ],
          },
        },
      },
    },
    authors: [],
  };
}
