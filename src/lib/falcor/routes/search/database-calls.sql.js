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

export async function searchScoredQuery(queries, min, max) {
  const results = {};

  const rowsArray = await Promise.all(
    queries.map(query =>
      database
        .select('slug')
        .from(function getScore() {
          this.select(
            'slug',
            database.raw(
              '( ' +
                '( MATCH(title) AGAINST(:query in NATURAL LANGUAGE MODE) )*3 ' +
                '+ ( MATCH(markdown) AGAINST(:query in NATURAL LANGUAGE MODE) ) ' +
                ') as tot_score ',
              {
                query,
              },
            ),
          )
            .from('articles')
            .as('temp_table');
        })
        .where('temp_table.tot_score', '>', 0)
        .orderBy('temp_table.tot_score', 'desc')
        .limit(max - min + 1)
        .offset(min),
    ),
  );

  queries.forEach((query, index) => {
    results[query] = rowsArray[index].map(row => row.slug);
  });

  return results;
}
