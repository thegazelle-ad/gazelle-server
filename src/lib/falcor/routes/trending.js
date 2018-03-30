import falcor from 'falcor';

import * as db from 'lib/db';

const $ref = falcor.Model.ref;

export default [
  {
    // Get trending articles
    // THIS IS TEMPORARY
    route: 'trending[{integers:indices}]',
    get: pathSet =>
      new Promise(resolve => {
        // This function will at the moment only return 10 trending articles
        // so you cannot request anything above index 9
        db.trendingQuery().then(data => {
          const results = [];
          pathSet.indices.forEach(index => {
            if (index < data.length) {
              results.push({
                path: ['trending', index],
                value: $ref(['articles', 'bySlug', data[index].slug]),
              });
            }
          });
          resolve(results);
        });
      }),
  },
];
