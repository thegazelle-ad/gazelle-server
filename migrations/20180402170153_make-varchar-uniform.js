/* eslint-disable */
exports.up = async knex => {
  await knex.schema.alterTable('articles', table => {
    table
      .string('slug')
      .notNullable()
      .alter();
    table
      .string('title')
      .notNullable()
      .alter();
  });
  await knex.schema.alterTable('categories', table => {
    table
      .string('slug')
      .notNullable()
      .alter();
    table
      .string('name')
      .notNullable()
      .alter();
  });
  await knex.schema.alterTable('info_pages', table => {
    table
      .string('slug')
      .notNullable()
      .alter();
    table
      .string('title')
      .notNullable()
      .alter();
  });
  await knex.schema.alterTable('issues', table => {
    table
      .string('name')
      .notNullable()
      .alter();
  });
  await knex.schema.alterTable('semesters', table => {
    table
      .string('name')
      .notNullable()
      .alter();
  });
  await knex.schema.alterTable('staff', table => {
    table
      .string('slug')
      .notNullable()
      .alter();
    table
      .string('name')
      .notNullable()
      .alter();
    table.string('job_title').alter();
    table.string('biography', 1000).alter();
    table.text('image_url').alter();
  });
  await knex.schema.alterTable('tags', table => {
    table
      .string('name')
      .notNullable()
      .alter();
    table
      .string('slug')
      .notNullable()
      .alter();
  });
  await knex.schema.alterTable('teams', table => {
    table
      .string('name')
      .notNullable()
      .alter();
    table
      .string('slug')
      .notNullable()
      .alter();
  });
};

exports.down = async knex => {
  await knex.schema.alterTable('articles', table => {
    table
      .string('slug', 150)
      .notNullable()
      .alter();
    table
      .string('title', 150)
      .notNullable()
      .alter();
  });
  await knex.schema.alterTable('categories', table => {
    table
      .string('slug', 70)
      .notNullable()
      .alter();
    table
      .string('name', 70)
      .notNullable()
      .alter();
  });
  await knex.schema.alterTable('info_pages', table => {
    table
      .string('slug', 70)
      .notNullable()
      .alter();
    table
      .string('title', 70)
      .notNullable()
      .alter();
  });
  await knex.schema.alterTable('issues', table => {
    table
      .string('name', 70)
      .notNullable()
      .alter();
  });
  await knex.schema.alterTable('semesters', table => {
    table
      .string('name', 70)
      .notNullable()
      .alter();
  });
  await knex.schema.alterTable('staff', table => {
    table
      .string('slug', 70)
      .notNullable()
      .alter();
    table
      .string('name', 70)
      .notNullable()
      .alter();
    table.string('job_title', 70).alter();
    table.string('biography', 400).alter();
    table.text('image_url').alter();
  });
  await knex.schema.alterTable('tags', table => {
    table
      .string('name', 150)
      .notNullable()
      .alter();
    table
      .string('slug', 150)
      .notNullable()
      .alter();
  });
  await knex.schema.alterTable('teams', table => {
    table
      .string('name', 70)
      .notNullable()
      .alter();
    table
      .string('slug', 70)
      .notNullable()
      .alter();
  });
};
