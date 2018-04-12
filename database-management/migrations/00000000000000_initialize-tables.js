const { executeDump } = require('./lib/execute-dump.js');

exports.up = async knex => {
  /**
   * This is a hacky initialization just so we have our starting point. It's correct as it's a dump
   * (without the data) of the database table structure at the time we started writing migrations
   * but because it's a dump it could of course be more readable. It would just have been too
   * tedious (and error prone) writing out the create table statements for all the Ghost tables
   * as we have also already stopped using them.
   */
  await executeDump(knex, 'initialTables.dump');
};

exports.down = async knex => {
  // Tables that don't have any foreign keys referencing them
  const unReferencedTablesToDrop = [
    'accesstokens',
    'app_fields',
    'app_settings',
    'authors_posts',
    'client_trusted_domains',
    'info_pages',
    'interactive_meta',
    'issues_categories_order',
    'issues_posts_order',
    'permissions',
    'permissions_apps',
    'permissions_roles',
    'permissions_users',
    'posts_tags',
    'refreshtokens',
    'roles',
    'roles_users',
    'settings',
    'subscribers',
    'teams_authors',
  ];
  // Tables that have foreign keys referencing them
  const tablesToDropRound2 = [
    'apps',
    'posts_meta',
    'semesters',
    'tags',
    'clients',
    'users',
    'authors',
    'issues',
  ];
  // Tables that had tables from round 1 AND 2 referencing them
  const tablesToDropRound3 = ['categories', 'posts', 'teams'];

  await Promise.all(
    unReferencedTablesToDrop.map(x => knex.schema.dropTable(x)),
  );
  await Promise.all(tablesToDropRound2.map(x => knex.schema.dropTable(x)));
  await Promise.all(tablesToDropRound3.map(x => knex.schema.dropTable(x)));
};
