module.exports.addDummyCategories = (knex, numCategories) => {
  const hardcodedCategories = [
    { name: 'news', slug: 'news' },
    { name: 'features', slug: 'features' },
    { name: 'opinion', slug: 'opinion' },
    { name: 'multimedia', slug: 'media' },
  ];

  const rows = [];
  for (let i = 0; i < numCategories; i++) {
    const id = i + 1;
    let name;
    let slug;
    if (i < numCategories) {
      ({ name, slug } = hardcodedCategories[i]);
    } else {
      [name, slug] = [`category${id}`, `category${id}`];
    }
    rows.push({
      id,
      slug,
      name,
    });
  }
  return knex('categories').insert(rows);
};
