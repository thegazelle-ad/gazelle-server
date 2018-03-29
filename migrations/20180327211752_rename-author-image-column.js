exports.up = async knex => {
  // eslint-disable-next-line no-unused-expressions
  await knex.schema.alterTable('authors', table => {
    table.renameColumn('image', 'image_url');
  });
};

exports.down = () => {
  // It is too bothersome to write the reverse migration here, so I simply won't <.<
};
