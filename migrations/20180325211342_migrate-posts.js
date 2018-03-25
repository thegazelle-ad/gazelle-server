/* eslint-disable */
exports.up = async knex => {
  // Create the new table where relevant posts and posts_meta will go in
  await knex.schema.createTable('articles', table => {
    table.increments('id').primary().unique().notNullable();
    table.string('slug', 150).unique().notNullable();
    table.string('title', 150).notNullable();
    table.text('markdown', 'mediumtext');
    table.text('html', 'mediumtext');
    table.string('image_url');
    table.string('teaser');
    table.integer('views').unsigned().notNullable().defaultTo(0);
    table.dateTime('published_at');
    table.boolean('is_interactive').notNullable().defaultTo(false);
    table.integer('category_id').unsigned().references('id').inTable('categories')
      .onDelete('SET NULL').onUpdate('CASCADE');
  });
  // Now we copy over the data from the two tables into the new one

  // We first have to convert the posts table to latin1 so we correctly interpret it
  const tableName = 'posts';
  const charset = 'latin1';
  await knex.schema.raw(`ALTER TABLE ${tableName} CONVERT TO CHARACTER SET ${charset}`);

  const postRows = await knex.select('*').from('posts');
  const metaRows = await knex.select('*').from('posts_meta');

  const convertedPostRows = postRows.map(row => ({
    id: row.id,
    title: row.title,
    slug: row.slug,
    markdown: row.markdown,
    html: row.html,
    image_url: row.image,
    teaser: row.meta_description,
  }));
  const convertedMetaRows = metaRows.map(row => ({
    id: row.id,
    category_id: row.category_id,
    views: row.views,
    published_at: row.gazelle_published_at,
    is_interactive: row.is_interactive,
  }));

  const articleRows = convertedPostRows.map(postRow => {
    const metaRow = convertedMetaRows.find(_metaRow => _metaRow.id === postRow.id) || {};
    return {
      ...postRow,
      ...metaRow,
    };
  }).filter(row => row);

  // We need to split them up in chunks or mysql throws errors because of too big single request
  const chunkSize = 100;
  const n = articleRows.length;
  const promises = [];
  for (let startIndex = 0; startIndex < n; startIndex += chunkSize) {
    const subArray = articleRows.slice(startIndex, startIndex + chunkSize);
    promises.push(knex('articles').insert(subArray));
    if (promises.length === 10) {
      await Promise.all(promises);
      promises.length = 0;
    }
  }
  await Promise.all(promises);

  // Now we need to update all the foreign keys that were referencing any of the two tables
  await Promise.all([
    await knex.schema.alterTable('authors_posts', table => {
      table.dropForeign('post_id');
      table.renameColumn('post_id', 'article_id');
      table.foreign('article_id').references('id').inTable('articles')
        .onDelete('CASCADE').onUpdate('CASCADE');
    }),
    await knex.schema.alterTable('interactive_meta', table => {
      table.dropForeign('id');
      table.foreign('id').references('id').inTable('articles')
        .onDelete('CASCADE').onUpdate('CASCADE');
    }),
    await knex.schema.alterTable('issues_posts_order', table => {
      table.dropForeign('post_id');
      table.renameColumn('post_id', 'article_id');
      table.foreign('article_id').references('id').inTable('articles')
        .onDelete('CASCADE').onUpdate('CASCADE');
    }),
    await knex.schema.alterTable('posts_tags', table => {
      table.dropForeign('post_id');
      table.renameColumn('post_id', 'article_id');
      table.foreign('article_id').references('id').inTable('articles')
        .onDelete('CASCADE').onUpdate('CASCADE');
    }),
  ]);
  await knex.schema.renameTable('posts_tags', 'articles_tags');

  // And now we can finally drop the old tables!
  await knex.schema.dropTable('posts_meta');
  await knex.schema.dropTable('posts');
};


exports.down = knex => {
  // It is too bothersome to write the reverse migration here, so I simply won't <.<
};
