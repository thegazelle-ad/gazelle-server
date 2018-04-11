module.exports.addIssueCategoryOrdering = (knex, numIssues, numCategories) => {
  const rows = [];
  for (let i = 0; i < numIssues; i++) {
    for (let j = 0; j < numCategories; j++) {
      const id = i * numCategories + j + 1;
      const issueId = i + 1;
      const categoryId = j % numCategories + 1;
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
