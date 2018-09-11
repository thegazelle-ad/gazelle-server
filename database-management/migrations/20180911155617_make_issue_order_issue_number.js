exports.up = async knex => {
  await knex.schema.alterTable('issues', table => {
    table.renameColumn('issue_order', 'issue_number');
  });
};

exports.down = async knex => {
  await knex.schema.alterTable('issues', table => {
    table.renameColumn('issue_number', 'issue_order');
  });
};
