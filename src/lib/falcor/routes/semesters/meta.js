import falcor from 'falcor';

import * as db from 'lib/db';

const $ref = falcor.Model.ref;

export default [
  {
    route: "semesters['latest']",
    get: () =>
      new Promise((resolve, reject) => {
        db.getLatestSemester()
          .then(semesterName => {
            resolve([
              {
                path: ['semesters', 'latest'],
                value: $ref(['semesters', 'byName', semesterName]),
              },
            ]);
          })
          .catch(reject);
      }),
  },
];
