import * as db from 'lib/db';
import { has } from 'lib/utilities';

export default [
  {
    route: "infoPages[{keys:slugs}]['title', 'html', 'slug']",
    get: pathSet =>
      new Promise(resolve => {
        const requestedFields = pathSet[2];
        db.infoPagesQuery(pathSet.slugs, requestedFields).then(data => {
          // data function parameter is an array of objects with keys equal to requested columns
          // Always returns the slug so we know which one we got
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
          resolve(results);
        });
      }),
  },
];
