import falcor from 'falcor';
import _ from 'lodash';

import * as db from 'lib/db';
import { cleanupJsonGraphArg } from 'lib/falcor/falcor-utilities';
import { has } from 'lib/utilities';

const $ref = falcor.Model.ref;

export default [
  {
    // eslint-disable-next-line max-len
    route:
      "staff['bySlug'][{keys:slugs}]['id', 'name', 'image_url', 'biography', 'slug', 'job_title']",
    get: pathSet =>
      new Promise(resolve => {
        const requestedFields = pathSet[3];
        db.authorQuery(pathSet.slugs, requestedFields).then(data => {
          // always returns slug in the object no matter what.
          const results = [];
          data.forEach(author => {
            requestedFields.forEach(field => {
              results.push({
                path: ['staff', 'bySlug', author.slug, field],
                value: author[field],
              });
            });
          });
          resolve(results);
        });
      }),
    set: jsonGraphArg =>
      new Promise((resolve, reject) => {
        jsonGraphArg = cleanupJsonGraphArg(jsonGraphArg); // eslint-disable-line no-param-reassign
        const staffBySlug = jsonGraphArg.staff.bySlug;
        db
          .updateMainAuthorData(staffBySlug)
          .then(flag => {
            if (!flag) {
              throw new Error(
                'For unknown reasons updateMainAuthorData returned a non-true flag',
              );
            }
            const results = [];
            _.forEach(staffBySlug, (authorObject, slug) => {
              _.forEach(authorObject, (value, field) => {
                results.push({
                  path: ['staff', 'bySlug', slug, field],
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
  {
    route: "staff['bySlug'][{keys:slugs}]['teams'][{integers:indices}]",
    get: pathSet =>
      new Promise(resolve => {
        db.authorTeamQuery(pathSet.slugs).then(data => {
          const results = [];
          _.forEach(data, (teamSlugArray, authorSlug) => {
            pathSet.indices.forEach(index => {
              if (index < teamSlugArray.length) {
                results.push({
                  path: ['staff', 'bySlug', authorSlug, 'teams', index],
                  value: $ref(['teams', 'bySlug', teamSlugArray[index]]),
                });
              }
            });
          });
          resolve(results);
        });
      }),
  },
  {
    route: "staff['bySlug'][{keys:slugs}]['articles'][{integers:indices}]",
    // This could be a bit vulnerable as it fetches all articles written by an author
    // no matter what indices are called, but I think in reality it shouldn't be a problem
    get: pathSet =>
      new Promise(resolve => {
        db.authorArticleQuery(pathSet.slugs).then(data => {
          // We receive the data as an object with keys equalling author slugs
          // and values being an array of article slugs where the most recent is first
          const results = [];
          _.forEach(data, (postSlugArray, authorSlug) => {
            pathSet.indices.forEach(index => {
              if (index < postSlugArray.length) {
                results.push({
                  path: ['staff', 'bySlug', authorSlug, 'articles', index],
                  value: $ref(['articles', 'bySlug', postSlugArray[index]]),
                });
              }
            });
          });
          resolve(results);
        });
      }),
  },
  {
    route: "staff['bySlug']['createAuthor']",
    call: (callPath, args) =>
      new Promise(resolve => {
        const authorObject = args[0];
        if (
          !(has.call(authorObject, 'slug') && has.call(authorObject, 'name'))
        ) {
          throw new Error(
            'When creating an author you must provide both name and slug',
          );
        }
        db.createAuthor(authorObject).then(flag => {
          if (flag !== true) {
            throw new Error('Create Author function returned non-true flag');
          }
          const results = [];
          const authorSlug = authorObject.slug;
          _.forEach(authorObject, (value, field) => {
            results.push({
              path: ['staff', 'bySlug', authorSlug, field],
              value,
            });
          });
          resolve(results);
        });
      }),
  },
];
