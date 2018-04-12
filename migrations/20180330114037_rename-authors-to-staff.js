exports.up = async knex => {
  await knex.schema.renameTable('authors', 'staff');
  await knex.schema.renameTable('teams_authors', 'teams_staff');
  await knex.schema.alterTable('teams_staff', table => {
    table.renameColumn('author_id', 'staff_id');
    table.renameColumn('author_order', 'staff_order');
  });
};

exports.down = async knex => {
  await knex.schema.alterTable('teams_staff', table => {
    table.renameColumn('staff_id', 'author_id');
    table.renameColumn('staff_order', 'author_order');
  });
  await knex.schema.renameTable('staff', 'authors');
  await knex.schema.renameTable('teams_staff', 'teams_authors');
};
