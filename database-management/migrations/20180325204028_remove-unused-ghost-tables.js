const { executeDump } = require('./lib/execute-dump.js');

exports.up = async knex => {
  // These tables don't have any tables referencing them
  const unReferencedTablesToDrop = [
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
  ];
  // These tables are referenced by the above tables
  const referencedTablesToDrop = ['users', 'clients'];
  await Promise.all(
    unReferencedTablesToDrop.map(x => knex.schema.dropTable(x)),
  );
  await Promise.all(referencedTablesToDrop.map(x => knex.schema.dropTable(x)));
};

exports.down = async knex => {
  /**
   * We used the same technique as in the initialize-tables migration
   */
  await executeDump(knex, 'unusedGhostTables.dump');
};
