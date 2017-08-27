import falcor from 'falcor';

import DbFunctions from 'lib/db';

const db = new DbFunctions;
const $ref = falcor.Model.ref;

export default [
  {
    // Get latest issue
    route: 'latestIssue',
    get: () => (
      new Promise((resolve) => {
        db.latestIssueQuery().then((row) => {
          resolve([{
            path: ['latestIssue'],
            value: $ref(['issuesByNumber', row[0].issue_order]),
          }]);
        });
      })
    ),
  },
];
