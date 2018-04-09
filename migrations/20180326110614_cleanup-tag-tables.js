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

// eslint-disable-next-line no-unused-vars
exports.down = knex => {
  // It is probably impossible to revert all the lost data that is
  // delete through the migration as it was no longer needed so
  // we don't even try this as there are not nullable columns
  // without default values that we dropped, so we can't make it work
};
