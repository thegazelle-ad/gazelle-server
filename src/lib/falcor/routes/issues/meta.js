import falcor from 'falcor';

import * as db from 'lib/db';

const $ref = falcor.Model.ref;

export default [
  {
    // Get latest issue
    route: "issues['latest']",
    get: () =>
      new Promise(resolve => {
        db.latestIssueQuery().then(row => {
          resolve([
            {
              path: ['issues', 'latest'],
              value: $ref(['issues', 'byNumber', row[0].issue_number]),
            },
          ]);
        });
      }),
  },
];
