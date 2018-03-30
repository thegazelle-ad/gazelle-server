import falcor from 'falcor';
import _ from 'lodash';

import * as db from 'lib/db';

const $ref = falcor.Model.ref;

export default [
  {
    route: "search['teams'][{keys:queries}][{integers:indices}]",
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
        db.searchTeamsQuery(pathSet.queries, minIndex, maxIndex).then(data => {
          // Map all the indices down to fit the indices returned by the db call
          const pathSetInstance = pathSet;
          pathSetInstance.indices = pathSetInstance.indices.map(
            index => index - minIndex,
          );
          const results = [];
          _.forEach(data, (queryResults, query) => {
            pathSetInstance.indices.forEach(index => {
              if (index < queryResults.length) {
                results.push({
                  path: ['search', 'teams', query, index],
                  value: $ref(['teams', 'bySlug', queryResults[index]]),
                });
              }
            });
          });
          resolve(results);
        });
      }),
  },
];
