exports.up = async knex => {
  await Promise.all([
    knex.raw('ALTER TABLE articles ADD FULLTEXT(title)'),
    knex.raw('ALTER TABLE articles ADD FULLTEXT(markdown)'),
  ]);
  // Using a raw query above since knex does not support fulltext indexing
};

exports.down = async knex => {
  await Promise.all([
    knex.raw('ALTER TABLE articles DROP INDEX title'),
    knex.raw('ALTER TABLE articles DROP INDEX markdown'),
  ]);
};
