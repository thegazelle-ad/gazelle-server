const { issueHasCategory } = require('./utilities');

module.exports.addIssueCategoryOrdering = (
  knex,
  numIssues,
  numCategories,
  numArticles,
) => {
  const rows = [];
  let id = 0;
  for (let i = 0; i < numIssues; i++) {
    let categoriesOrder = 0;
    for (let j = 0; j < numCategories; j++) {
      const issueId = i + 1;
      const categoryId = j + 1;
      if (
        issueHasCategory(
          issueId,
          categoryId,
          numCategories,
          numIssues,
          numArticles,
        )
      ) {
        id += 1;
        rows.push({
          id,
          issue_id: issueId,
          category_id: categoryId,
          categories_order: categoriesOrder,
        });
        categoriesOrder += 1;
      }
    }
  }
  return knex('issues_categories_order').insert(rows);
};
