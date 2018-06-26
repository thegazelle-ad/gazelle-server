exports.up = async knex => {
  await knex.raw(
    'ALTER TABLE articles ADD FULLTEXT `article-search-index` (title, markdown)',
  );
  // Using a raw query above since knex does not support fulltext indexing
};

exports.down = async knex => {
  await knex.schema.table('articles', table => {
    table.dropIndex(['title', 'markdown'], 'article-search-index');
  });
};
