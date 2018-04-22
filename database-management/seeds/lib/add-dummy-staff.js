const { loremIpsum, placeImg } = require('./constants');

module.exports.addDummyStaff = (knex, numStaff) => {
  const rows = [];
  for (let i = 1; i <= numStaff; i++) {
    rows.push({
      id: i,
      slug: `staff${i}`,
      name: `firstname${i} lastname${i}`,
      job_title: 'contributor',
      biography: loremIpsum.substr(0, 400),
      image_url: placeImg,
    });
  }
  return knex('staff').insert(rows);
};
