module.exports.addDummyTags = (knex, numTags) => {
  const rows = [];
  for (let i = 1; i <= numTags; i++) {
    rows.push({
      id: i,
      slug: `tag${i}`,
      name: `tag${i}`,
    });
  }
  return knex('tags').insert(rows);
};
