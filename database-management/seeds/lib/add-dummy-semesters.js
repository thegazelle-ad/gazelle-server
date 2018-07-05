const moment = require('moment');

module.exports.addDummySemesters = (knex, numSemesters) => {
  const START_DATE = moment('2018-02-01');
  const hardcodedSemesters = [
    {
      name: 'Spring 2018',
      date: START_DATE.toDate(),
    },
  ];
  const rows = [];
  for (let i = 0; i < numSemesters; i++) {
    const id = i + 1;
    let name;
    let date;
    if (i < numSemesters) {
      ({ name, date } = hardcodedSemesters[i]);
    } else {
      [name, date] = [
        `semester${id}`,
        START_DATE.add(i * 6, 'months').toDate(),
      ];
    }
    rows.push({
      id,
      name,
      date,
    });
  }
  return knex('semesters').insert(rows);
};
