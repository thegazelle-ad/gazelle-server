exports.up = knex =>
  knex.schema.alterTable('authors', table => {
    table.renameColumn('image', 'image_url');
  });

exports.down = knex =>
  knex.schema.alterTable('authors', table => {
    table.renameColumn('image_url', 'image');
  });
