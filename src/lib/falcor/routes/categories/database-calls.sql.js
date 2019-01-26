import { has } from 'lib/utilities';

export async function categoryArticleQuery(database, ids) {
  const rows = await database
    .select('id as articleId', 'category_id as categoryId')
    .from('articles')
    .whereIn('category_id', ids)
    .whereNotNull('published_at')
    .orderBy('published_at', 'desc');

  const data = {};
  // We build the data
  rows.forEach(row => {
    // This will input them in chronological order as the query was structured as so.
    if (!has.call(data, row.categoryId)) {
      data[row.categoryId] = [row.articleId];
    } else {
      data[row.categoryId].push(row.articleId);
    }
  });
  return data;
}
