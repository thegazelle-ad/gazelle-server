import falcor from 'falcor';
import _ from 'lodash';

import * as db from 'lib/db';
import { staffQuery } from './database-calls.sql';
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
        staffQuery(db.database, 'slug', pathSet.slugs, requestedFields).then(
          data => {
            // always returns slug in the object no matter what.
            const results = [];
            data.forEach(staff => {
              requestedFields.forEach(field => {
                results.push({
                  path: ['staff', 'bySlug', staff.slug, field],
                  value: staff[field],
                });
              });
            });
            resolve(results);
          },
        );
      }),
    set: jsonGraphArg =>
      new Promise((resolve, reject) => {
        const staffBySlug = jsonGraphArg.staff.bySlug;
        db.updateMainStaffData(staffBySlug)
          .then(flag => {
            if (!flag) {
              throw new Error(
                'For unknown reasons updateMainStaffData returned a non-true flag',
              );
            }
            const results = [];
            _.forEach(staffBySlug, (staffObject, slug) => {
              _.forEach(staffObject, (value, field) => {
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
        db.staffTeamQuery(pathSet.slugs).then(data => {
          const results = [];
          _.forEach(data, (teamSlugArray, staffSlug) => {
            pathSet.indices.forEach(index => {
              if (index < teamSlugArray.length) {
                results.push({
                  path: ['staff', 'bySlug', staffSlug, 'teams', index],
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
          // We receive the data as an object with keys equalling staff member slugs
          // and values being an array of article slugs where the most recent is first
          const results = [];
          _.forEach(data, (postSlugArray, staffSlug) => {
            pathSet.indices.forEach(index => {
              if (index < postSlugArray.length) {
                results.push({
                  path: ['staff', 'bySlug', staffSlug, 'articles', index],
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
    route: "staff['bySlug']['createStaff']",
    call: (callPath, args) =>
      new Promise(resolve => {
        const staffObject = args[0];
        if (!(has.call(staffObject, 'slug') && has.call(staffObject, 'name'))) {
          throw new Error(
            'When creating a staff member you must provide both name and slug',
          );
        }
        db.createStaff(staffObject).then(flag => {
          if (flag !== true) {
            throw new Error('Create Staff function returned non-true flag');
          }
          const results = [];
          const staffSlug = staffObject.slug;
          _.forEach(staffObject, (value, field) => {
            results.push({
              path: ['staff', 'bySlug', staffSlug, field],
              value,
            });
          });
          resolve(results);
        });
      }),
  },
];
