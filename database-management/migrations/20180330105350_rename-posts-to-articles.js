exports.up = async knex => {
  await knex.schema.renameTable('authors_posts', 'authors_articles');
  await knex.schema.renameTable('issues_posts_order', 'issues_articles_order');
  await knex.schema.alterTable('issues_articles_order', table => {
    table.renameColumn('posts_order', 'article_order');
  });
};

exports.down = async knex => {
  await knex.schema.alterTable('issues_articles_order', table => {
    table.renameColumn('article_order', 'posts_order');
  });
  await knex.schema.renameTable('authors_articles', 'authors_posts');
  await knex.schema.renameTable('issues_articles_order', 'issues_posts_order');
};
