import _ from 'lodash';

import { tagQuery, updateTags } from './database-calls';

export const routes = [
  {
    route: "tags['byId'][{keys:ids}]['id', 'name', 'slug']",
    get: pathSet =>
      new Promise(resolve => {
        const requestedFields = pathSet[3];
        tagQuery('id', pathSet.ids, requestedFields).then(data => {
          const results = [];
          data.forEach(tag => {
            requestedFields.forEach(field => {
              results.push({
                path: ['tags', 'byId', tag.id, field],
                value: tag[field],
              });
            });
          });
          resolve(results);
        });
      }),
    set: jsonGraphArg =>
      new Promise((resolve, reject) => {
        const tagsById = jsonGraphArg.tags.byId;
        updateTags(tagsById)
          .then(flag => {
            if (!flag) {
              throw new Error(
                'For unknown reasons updateTags returned a non-true flag',
              );
            }
            const results = [];
            _.forEach(tagsById, (tagObject, id) => {
              _.forEach(tagObject, (value, field) => {
                results.push({
                  path: ['tags', 'byId', id, field],
                  value,
                });
              });
            });
            resolve(results);
          })
          .catch(e => {
            reject(e);
          });
      }),
  },
];
