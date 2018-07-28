import falcor from 'falcor';
import _ from 'lodash';

import { getPaginatedArticle } from './database-calls.sql';
import { database } from 'lib/db';

const $ref = falcor.Model.ref;

export const routes = [
  {
    /*
    Get articles by page (they are also in chronological order, articles['byPage'][pageLength][1][0]
    is the latest published article to the Ghost database). Only use positive integer page lengths
    and page numbers, and non-negative page indices. [{integers:indicesOnPage}] is logically
    redundant but needed for working properly with falcor. Normal falcorPath syntax would be:
    articles['byPage'][pageLength][pageIndex][{length: pageLength}]
    where {length: pageLength} makes use of falcor's range object.
    */
    route:
      "articles['byPage'][{integers:pageLengths}][{integers:pageIndices}][{integers:indicesOnPage}]",
    get: async pathSet => {
      validatePaginationQuery(
        pathSet.pageLengths,
        pathSet.pageIndices,
        pathSet.indicesOnPage,
      );
      // Because we validated that they want all indices on a page we no longer need that variable
      const pageLength = pathSet.pageLengths[0];
      const pageIndex = pathSet.pageIndices[0];

      const articles = await getPaginatedArticle(
        database,
        pageLength,
        pageIndex,
      );
      const results = articles.map(({ slug }, index) => ({
        path: ['articles', 'byPage', pageLength, pageIndex, index],
        value: $ref(['articles', 'bySlug', slug]),
      }));
      return results;
    },
  },
];

/**
 * @param {number} pageLengths
 * @param {number} pageIndices
 * @param {number} indicesOnPage
 * @throws if invalid, otherwise it'll finish silently
 */
function validatePaginationQuery(pageLengths, pageIndices, indicesOnPage) {
  if (pageLengths.length !== 1) {
    throw new Error(
      "We only allow passing a single pageLength at a time to articles['byPage']",
    );
  }
  if (pageLengths[0] < 1) {
    throw new Error('pageLength must be at least 1');
  }
  // It would be pretty simple to extend it to several pages, but as long as we don't use it
  // we can just as well make our SQL logic easier
  if (pageIndices.length !== 1) {
    throw new Error(
      "We only allow passing a single pageIndex at a time to articles['byPage']",
    );
  }
  if (pageIndices[0] < 0) {
    throw new Error('page indices must be non-negative');
  }
  if (indicesOnPage.length !== pageLengths[0]) {
    throw new Error(
      'You should always try fetching all the indices on a page, ' +
        'use {length: pageLength} for indices',
    );
  }
  if (_.uniq(indicesOnPage).length !== indicesOnPage.length) {
    throw new Error('All the indicesOnPage should be unique');
  }
  indicesOnPage.forEach(index => {
    if (index < 0 || index >= pageLengths[0]) {
      throw new Error('out of range indicesOnPage index passed');
    }
  });
}
