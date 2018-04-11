module.exports.addDummyCategories = (knex, numCategories) => {
  const hardcodedCategories = ['news', 'features', 'opinion', 'multimedia'];

  const rows = [];
  for (let i = 0; i < numCategories; i++) {
    const id = i + 1;
    let name;
    let slug;
    if (i < numCategories) {
      [name, slug] = [hardcodedCategories[i], hardcodedCategories[i]];
    } else {
      [name, slug] = [`category${i}`, `category${i}`];
    }
    rows.push({
      id,
      slug,
      name,
    });
  }
  return knex('categories').insert(rows);
};
