module.exports.deleteExistingData = async knex => {
  // Order matters here
  const tablesToClean = [
    'issues_articles_order',
    'issues_categories_order',
    'interactive_meta',
    'articles_tags',
    'authors_articles',
    'teams_staff',
    'articles',
    'categories',
    'info_pages',
    'issues',
    'semesters',
    'staff',
    'tags',
    'teams',
  ];

  // eslint-disable-next-line no-restricted-syntax
  for (const tableName of tablesToClean) {
    // eslint-disable-next-line no-await-in-loop
    await knex(tableName).del();
  }
};
