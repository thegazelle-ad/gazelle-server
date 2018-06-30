module.exports.addArticleTagRelationship = (knex, numArticles, numTags) => {
  const rows = [];
  for (let i = 0; i < numArticles; i++) {
    for (let j = 0; j < 2; j++) {
      const id = i * 2 + j + 1;
      const articleId = i + 1;
      // Just adding a slight bit of randomness
      const tagId = (((j + 1) * i) % numTags) + 1;
      rows.push({
        id,
        article_id: articleId,
        tag_id: tagId,
      });
    }
  }
  return knex('articles_tags').insert(rows);
};
