module.exports.getCategoryId = (articleId, numCategories) =>
  (articleId - 1) % numCategories + 1;

module.exports.getIssueId = (articleId, numIssues) =>
  (articleId - 1) % numIssues + 1;

const getArticlesInIssue = (issueId, numArticles, numIssues) => {
  const articles = [];
  for (let articleId = 1; articleId <= numArticles; articleId++) {
    if (issueId === module.exports.getIssueId(articleId, numIssues)) {
      articles.push(articleId);
    }
  }
  return articles;
};
module.exports.issueHasCategory = (
  issueId,
  categoryId,
  numCategories,
  numIssues,
  numArticles,
) => {
  const articlesInIssue = getArticlesInIssue(issueId, numArticles, numIssues);
  const categoryFound = articlesInIssue.some(
    articleId =>
      module.exports.getCategoryId(articleId, numCategories) === categoryId,
  );
  return categoryFound;
};
