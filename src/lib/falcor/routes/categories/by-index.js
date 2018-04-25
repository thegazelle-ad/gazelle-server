import falcor from 'falcor';

import * as db from 'lib/db';

const $ref = falcor.Model.ref;

export const routes = [
  {
    // get categories by index
    route: "categories['byIndex'][{integers:indices}]",
    get: pathSet =>
      new Promise(resolve => {
        // This will fetch every single category at this time which shouldn't
        // at all be a problem at this capacity
        db.categoryArrayQuery().then(data => {
          // This function resolves an array of slugs
          const results = [];
          pathSet.indices.forEach(index => {
            if (index < data.length) {
              results.push({
                path: ['categories', 'byIndex', index],
                value: $ref(['categories', 'bySlug', data[index]]),
              });
            }
          });
          resolve(results);
        });
      }),
  },
];
