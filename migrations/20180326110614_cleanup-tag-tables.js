/* eslint-disable */
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
      ]
      columnsToDrop.forEach(name => table.dropColumn(name));
    })
  ]);
};

exports.down = knex => {
  // It is too bothersome to write the reverse migration here, so I simply won't <.<
};
