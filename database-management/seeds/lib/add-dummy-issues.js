const moment = require('moment');

module.exports.addDummyIssues = (knex, numIssues) => {
  const rows = [];
  const START_DATE = moment('2001-01-01');
  for (let i = 1; i <= numIssues; i++) {
    rows.push({
      id: i,
      name: `issue${i}`,
      published_at: START_DATE.add(i, 'days').toDate(),
      issue_number: i,
    });
  }
  return knex('issues').insert(rows);
};
