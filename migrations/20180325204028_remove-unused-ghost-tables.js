const { executeDump } = require('./lib/execute-dump.js');

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
    'refreshtokens',
    'roles',
    'roles_users',
    'settings',
    'subscribers',
    'users',
    'clients',
  ];
  // eslint-disable-next-line no-restricted-syntax
  for (const tableName of tablesToDrop) {
    // eslint-disable-next-line no-await-in-loop
    await knex.schema.dropTable(tableName);
  }
};

exports.down = async knex => {
  /**
   * We used the same technique as in the initialize-tables migration
   */
  await executeDump(knex, 'unusedGhostTables.dump');
};
