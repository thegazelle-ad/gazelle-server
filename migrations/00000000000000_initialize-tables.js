const fs = require('fs');
const path = require('path');

exports.up = async knex => {
  /**
   * This is a hacky initialization just so we have our starting point. It's correct as it's a dump
   * (without the data) of the database table structure at the time we started writing migrations
   * but because it's a dump it could of course be more readable. It would just have been too
   * tedious (and error prone) writing out the create table statements for all the Ghost tables
   * as we have also already stopped using them.
   */
  const initializerDump = fs.readFileSync(
    path.join(__dirname, 'initialTables.dump'),
    'utf8',
  );
  const commands = initializerDump
    .split(';')
    .map(x => x.trim())
    .filter(x => x);
  // eslint-disable-next-line no-restricted-syntax
  for (const singleCommand of commands) {
    // eslint-disable-next-line no-await-in-loop
    await knex.schema.raw(`${singleCommand};`);
  }
};

exports.down = async knex => {
  const tablesToDrop = [
    'accesstokens',
    'app_fields',
    'app_settings',
    'apps',
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
    'posts_meta',
    'semesters',
    'tags',
    'clients',
    'users',
    'categories',
    'authors',
    'issues',
    'posts',
    'teams',
  ];

  // eslint-disable-next-line no-restricted-syntax
  for (const tableName of tablesToDrop) {
    // eslint-disable-next-line no-await-in-loop
    await knex.schema.dropTable(tableName);
  }
};
