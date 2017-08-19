import falcor from 'falcor';

import { ghostArticleQuery } from 'lib/ghost-api';

const $ref = falcor.Model.ref;

export default [
  {
    /*
    Get articles by page (they are also in chronological order, articlesByPage[pageLength][1][0]
    is the latest published article to the Ghost database). Only use positive integer page lengths
    and page numbers, and non-negative page indices. [{integers:indicesOnPage}] is logically
    redundant but needed for working properly with falcor. Normal falcorPath syntax would be:
    articlesByPage[pageLength][pageNumber][{length: pageLength}]
    where {length: pageLength} makes use of falcor's range object.
    */
    route: 'articlesByPage[{integers:pageLengths}][{integers:pageNumbers}][{integers:indicesOnPage}]', // eslint-disable-line max-len
    get: (pathSet) => (
      new Promise((resolve) => {
        const results = [];
        const numberOfQueryCalls = pathSet.pageLengths.length * pathSet.pageNumbers.length;
        if (numberOfQueryCalls === 0) return;
        let queriesResolved = 0;
        pathSet.pageLengths.forEach((pageLength) => {
          if (pageLength < 1) {
            throw new Error(
              'Cannot pass nonpositive integer as the pageLength parameter. ' +
              `You passed ${pageLength} as one of your page lengths.`
            );
          }
          pathSet.pageNumbers.forEach((pageNumber) => {
            if (pageNumber < 1) {
              throw new Error(
                'Cannot pass nonpositive integer as the pageNumber parameter. ' +
                `You passed ${pageNumber} as one of your page numbers.`
              );
            }
            const query = `limit=${pageLength}&page=${pageNumber}&fields=slug`;
            ghostArticleQuery(query).then((data) => {
              if (data.hasOwnProperty('errors')) {
                throw new Error(
                  `Errors in the Ghost API query with query parameter = ${query}: ` +
                  `${JSON.stringify(data)}`
                );
              }
              const articles = data.posts;
              pathSet.indicesOnPage.forEach((index) => {
                if (index < 0) {
                  throw new Error(
                    'You cannot pass negative indices to the indexOnPage parameter. ' +
                    `You passed ${index} as one of your indices.`
                  );
                }
                if (index < articles.length) {
                  results.push({
                    path: ['articlesByPage', pageLength, pageNumber, index],
                    value: $ref(['articles', 'bySlug', articles[index].slug]),
                  });
                }
              });
              queriesResolved++;
              if (queriesResolved === numberOfQueryCalls) {
                resolve(results);
              }
            }).catch((err) => {
              // figure out what you should actually do here
              throw (err);
            });
          });
        });
      })
    ),
  },
];
