module.exports.addArticleAuthorRelationship = (
  knex,
  numArticles,
  numAuthors,
) => {
  const rows = [];
  for (let i = 0; i < numArticles; i++) {
    const id = i + 1;
    const articleId = i + 1;
    const authorId = articleId % numAuthors + 1;
    rows.push({
      id,
      article_id: articleId,
      author_id: authorId,
    });
  }
  return knex('authors_articles').insert(rows);
};
