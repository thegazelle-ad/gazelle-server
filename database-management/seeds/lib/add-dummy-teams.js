module.exports.addDummyTeams = (knex, numTeams) => {
  const hardcodedTeams = [
    'management',
    'editorial',
    'multimedia',
    'writers',
    'web',
  ];

  const rows = [];
  for (let i = 0; i < numTeams; i++) {
    const id = i + 1;
    let name;
    let slug;
    if (i < numTeams) {
      [name, slug] = [hardcodedTeams[i], hardcodedTeams[i]];
    } else {
      [name, slug] = [`team${i}`, `team${i}`];
    }
    rows.push({
      id,
      slug,
      name,
    });
  }
  return knex('teams').insert(rows);
};
