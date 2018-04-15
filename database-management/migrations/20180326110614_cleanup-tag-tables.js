exports.up = async knex => {
  await Promise.all([
    knex.schema.alterTable('articles_tags', table => {
      table.dropColumn('sort_order');
    }),
    knex.schema.alterTable('tags', table => {
      const columnsToDrop = [
        'uuid',
        'description',
        'image',
        'parent_id',
        'visibility',
        'meta_title',
        'meta_description',
        'created_at',
        'created_by',
        'updated_at',
        'updated_by',
      ];
      columnsToDrop.forEach(name => table.dropColumn(name));
    }),
  ]);
};

exports.down = async knex => {
  await Promise.all([
    knex.schema.alterTable('tags', table => {
      table.integer('uuid').notNullable();
      table.string('description', 200).defaultTo(null);
      table.text('image');
      table.integer('parent_id');
      table
        .string('visibility', 150)
        .notNullable()
        .defaultTo('public');
      table.string('meta_title', 150);
      table.string('meta_description', 200);
      table
        .datetime('created_at')
        .notNullable()
        // This default wasn't part of the original table but we only add it
        // since we lost the actual value of this table and for it to automatically
        // put in dummy data
        .defaultTo(knex.fn.now());
      table
        .integer('created_by')
        .notNullable()
        // Again not in the original table
        .defaultTo(1);
      table.datetime('updated_at');
      table.integer('updated_by');
    }),
    knex.schema.alterTable('articles_tags', table => {
      table
        .integer('sort_order')
        .unsigned()
        .notNullable()
        .defaultTo(0);
    }),
  ]);
};
