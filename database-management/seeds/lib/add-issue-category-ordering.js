module.exports.addIssueCategoryOrdering = (knex, numIssues, numCategories) => {
  const rows = [];
  let id = 0;
  for (let i = 0; i < numIssues; i++) {
    for (let j = 0; j < numCategories; j++) {
      id += 1;
      const issueId = i + 1;
      const categoryId = j + 1;
      rows.push({
        id,
        issue_id: issueId,
        category_id: categoryId,
        categories_order: j,
      });
    }
  }
  return knex('issues_categories_order').insert(rows);
};
