import falcor from 'falcor';

import DbFunctions from 'lib/db';

const db = new DbFunctions;
const $ref = falcor.Model.ref;

export default [
  {
    route: 'teamsByIndex[{integers:indices}]',
    get: (pathSet) => (
      new Promise((resolve) => {
        db.teamArrayQuery().then((data) => {
          const results = [];
          pathSet.indices.forEach((index) => {
            if (index < data.length) {
              results.push({
                path: ['teamsByIndex', index],
                value: $ref(['teams', 'bySlug', data[index]]),
              });
            }
          });
          resolve(results);
        });
      })
    ),
  },
];
