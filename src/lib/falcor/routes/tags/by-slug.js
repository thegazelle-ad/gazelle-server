import falcor from 'falcor';
import _ from 'lodash';

import { tagQuery, addTag } from './database-calls';
import { has } from 'lib/utilities';

const $ref = falcor.Model.ref;

export const routes = [
  {
    route: "tags['bySlug'][{keys:slugs}]",
    get: async pathSet => {
      const tags = await tagQuery('slug', pathSet.slugs, ['id', 'slug']);
      const results = tags.map(tagObject => ({
        path: ['tags', 'bySlug', tagObject.slug],
        value: $ref(['tags', 'byId', tagObject.id]),
      }));
      return results;
    },

    set: async jsonGraphArg => {
      const slugs = Object.keys(jsonGraphArg.tags.bySlug);
      const tags = await tagQuery('slug', slugs, ['id', 'slug']);
      const results = tags.map(tagObject => ({
        path: ['tags', 'bySlug', tagObject.slug],
        value: $ref(['tags', 'byId', tagObject.id]),
      }));
      return results;
    },
  },
  {
    route: "tags['bySlug']['addTag']",
    call: (callPath, args) =>
      new Promise(resolve => {
        const tagObject = args[0];
        if (!(has.call(tagObject, 'slug') && has.call(tagObject, 'name'))) {
          throw new Error(
            'When creating a tag you must provide both name and slug',
          );
        }
        addTag(tagObject).then(flag => {
          if (flag !== true) {
            throw new Error('Create Tag function returned non-true flag');
          }
          const results = [];
          const tagSlug = tagObject.slug;
          _.forEach(tagObject, (value, field) => {
            results.push({
              path: ['tags', 'bySlug', tagSlug, field],
              value,
            });
          });
          resolve(results);
        });
      }),
  },
];
