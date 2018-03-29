/* eslint-disable */

exports.up = async knex => {
  const tablesToDrop = [
    'accesstokens',
    'app_fields',
    'app_settings',
    'apps',
    'client_trusted_domains',
    'permissions',
    'permissions_apps',
    'permissions_roles',
    'permissions_users',
    'roles',
    'refreshtokens',
    'roles_users',
    'settings',
    'subscribers',
    'users',
    'clients',
  ];
  for (tableName of tablesToDrop) {
    await knex.schema.dropTable(tableName);
  }
};

exports.down = knex => {
  // It is too bothersome to write the reverse migration here, so I simply won't <.<
};
