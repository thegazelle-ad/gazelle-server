// eslint-disable-next-line no-unused-vars
export async function getPaginatedArticle(pageLength, pageIndex) {
  const articles = [];
  for (let i = 0; i < pageLength; i++) {
    articles.push({ slug: `slug-${i}` });
  }
  return articles;
}
