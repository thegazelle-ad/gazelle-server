import { database } from 'lib/db';

export async function searchTagsQuery(queries, min, max) {
  const results = {};

  const dbUpdate = queries.map(query =>
    database
      .select('slug')
      .from('tags')
      .where('name', 'like', `%${query}%`)
      .limit(max - min + 1)
      .offset(min),
  );

  const rowsArray = await Promise.all(dbUpdate);
  queries.map((query, index) => {
    results[query] = rowsArray[index].map(row => row.slug);
    return true;
  });
  return results;
}
