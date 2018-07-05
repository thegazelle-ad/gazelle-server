exports.up = async knex => {
  await knex.schema.alterTable('staff', table => {
    table.dropForeign('team_id', 'authors_team_id_foreign');
    table.dropColumn('team_id');
  });
};

exports.down = async knex => {
  await knex.schema.alterTable('staff', table => {
    table
      .integer('team_id')
      .unsigned()
      .unique();
    table
      .foreign('team_id', 'authors_team_id_foreign')
      .references('id')
      .inTable('teams')
      .onDelete('SET NULL')
      .onUpdate('CASCADE');
  });
};
