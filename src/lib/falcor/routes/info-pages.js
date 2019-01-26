import { simpleQuery } from 'lib/db';
import { has } from 'lib/utilities';

export default [
  {
    route: "infoPages[{keys:slugs}]['title', 'html', 'slug']",
    get: async pathSet => {
      const requestedFields = pathSet[2];
      const data = await simpleQuery('info_pages', 'slug', pathSet.slugs, requestedFields);
      const results = [];
      data.forEach(row => {
        requestedFields.forEach(key => {
          if (!has.call(row, key)) {
            throw new Error(
              "missing data in infoPages, it is not even null, simply doesn't return",
            );
          } else {
            results.push({
              path: ['infoPages', row.slug, key],
              value: row[key],
            });
          }
        });
      });
      return results;
    },
  },
];
