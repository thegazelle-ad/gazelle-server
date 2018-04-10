export async function getPaginatedArticle(pageLength, pageIndex) {
  const articles = [];
  for (
    let i = pageIndex * pageLength;
    i < pageIndex * pageLength + pageLength;
    i++
  ) {
    articles.push({ slug: `slug-${i}` });
  }
  return articles;
}
