import falcor from 'falcor';
import _ from 'lodash';

import { searchTagsQuery } from './database-calls';

const $ref = falcor.Model.ref;

export default [
  {
    // Search for staff member by name
    route: "search['tags'][{keys:queries}][{integers:indices}]",
    get: pathSet =>
      new Promise(resolve => {
        let minIndex = pathSet.indices[0];
        let maxIndex = pathSet.indices[0];
        pathSet.indices.forEach(index => {
          if (index < minIndex) {
            minIndex = index;
          }
          if (index > maxIndex) {
            maxIndex = index;
          }
        });
        searchTagsQuery(pathSet.queries, minIndex, maxIndex).then(data => {
          // Map all the indices down to fit the indices returned by the db call
          const processedPathSet = {
            ...pathSet,
            indices: pathSet.indices.map(index => index - minIndex),
          };
          const results = [];
          _.forEach(data, (queryResults, query) => {
            processedPathSet.indices.forEach(index => {
              if (index < queryResults.length) {
                results.push({
                  path: ['search', 'tags', query, index],
                  value: $ref(['tags', 'bySlug', queryResults[index]]),
                });
              }
            });
          });
          resolve(results);
        });
      }),
  },
];
