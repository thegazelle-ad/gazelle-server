const { getCategoryId, getIssueId } = require('./utilities');
/**
 * Note that the ordering we store here is not actually really used in the code
 * as of right now as we don't have the ability to edit anything but order of
 * categories in the admin interface. It is more stored for the future possibility
 * of ordering. I (Emil) also think that it would be very possibly to structure
 * this ordering better in the database, but that's for a future issue.
 *
 * Note that the type column is encoded as follows:
 * 0 => Normal article in category
 * 1 => Featured Article
 * 2 => Editor's Pick
 *
 * And that the article_order column is dependant on the category of the article,
 * despite category not being part of this table.
 * @param {any} knex - The database instance
 * @param {*} numIssues - Number of issues
 * @param {*} numCategories - Number of categories
 * @param {*} numArticles - Number of articles
 * @returns {Promise}
 */
module.exports.addIssueArticleOrdering = (
  knex,
  numIssues,
  numCategories,
  numArticles,
) => {
  const rows = [];
  let id = 0;

  for (let i = 0; i < numIssues; i++) {
    const numArticlesPerCategory = [];
    for (let k = 0; k < numCategories; k++) {
      numArticlesPerCategory.push(0);
    }
    let numFeaturedArticles = 0;
    let numEditorsPicks = 0;
    for (let j = 0; j < numArticles; j++) {
      const issueId = i + 1;
      const articleId = j + 1;
      const isInIssue = getIssueId(articleId, numIssues) === issueId;
      if (isInIssue) {
        id += 1;
        let type;
        let articleOrder;
        if (numFeaturedArticles === 0) {
          // We need to set a featured article still
          type = 1;
          articleOrder = 0;
          numFeaturedArticles += 1;
        } else if (numEditorsPicks < 2) {
          // We're stil lacking Editor's Picks
          type = 2;
          articleOrder = numEditorsPicks;
          numEditorsPicks += 1;
        } else {
          // Otherwise we just put it in the normal category section
          const categoryId = getCategoryId(articleId, numCategories);
          type = 0;
          articleOrder = numArticlesPerCategory[categoryId - 1];
          numArticlesPerCategory[categoryId - 1] += 1;
        }
        rows.push({
          id,
          issue_id: issueId,
          type,
          article_id: articleId,
          article_order: articleOrder,
        });
      }
    }
  }
  return knex('issues_articles_order').insert(rows);
};
