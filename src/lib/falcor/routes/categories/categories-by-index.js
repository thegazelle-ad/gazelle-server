import falcor from 'falcor';

import DbFunctions from 'lib/db';

const db = new DbFunctions;
const $ref = falcor.Model.ref;

export default [
  {
    // get categories by index
    route: 'categoriesByIndex[{integers:indices}]',
    get: (pathSet) => (
      new Promise((resolve) => {
        // This will fetch every single category at this time which shouldn't
        // at all be a problem at this capacity
        db.categoryArrayQuery().then((data) => {
          // This function resolves an array of slugs
          const results = [];
          pathSet.indices.forEach((index) => {
            if (index < data.length) {
              results.push({
                path: ['categoriesByIndex', index],
                value: $ref(['categoriesBySlug', data[index]]),
              });
            }
          });
          resolve(results);
        });
      })
    ),
  },
];
