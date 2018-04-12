const { loremIpsum, placeImg } = require('./constants');

module.exports.addDummyStaff = (knex, numStaff, numTeams) => {
  const rows = [];
  for (let i = 1; i <= numStaff; i++) {
    const teamId = (i - 0) % numTeams + 1;
    rows.push({
      id: i,
      slug: `staff${i}`,
      name: `firstname${i} lastname${i}`,
      team_id: teamId,
      job_title: 'contributor',
      biography: loremIpsum.substr(0, 400),
      image_url: placeImg,
    });
  }
  return knex('staff').insert(rows);
};
