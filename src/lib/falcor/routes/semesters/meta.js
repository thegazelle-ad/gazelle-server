import falcor from 'falcor';

import * as db from 'lib/db';

const $ref = falcor.Model.ref;

export default [
  {
    route: "semesters['latest']",
    get: () =>
      new Promise((resolve, reject) => {
        db.getLatestSemester('name')
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
  {
    route: "semesters['latest']['info']",
    get: () =>
      new Promise((resolve, reject) => {
        db.getLatestSemester('id')
          .then(semesterId => {
            resolve([
              {
                path: ['semesters', 'latest', 'info'],
                value: $ref(['semesters', 'byId', semesterId]),
              },
            ]);
          })
          .catch(reject);
      }),
  },
];
