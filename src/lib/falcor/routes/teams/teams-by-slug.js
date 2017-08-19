import falcor from 'falcor';
import _ from 'lodash';

import DbFunctions from 'lib/db';

const db = new DbFunctions;
const $ref = falcor.Model.ref;

export default [
  {
    route: "teamsBySlug[{keys:slugs}]['slug', 'id', 'name', 'description']",
    get: (pathSet) => (
      new Promise((resolve) => {
        const requestedFields = pathSet[2];
        db.teamQuery(pathSet.slugs, requestedFields).then((data) => {
          const results = [];
          data.forEach((team) => {
            requestedFields.forEach((field) => {
              results.push({
                path: ['teamsBySlug', team.slug, field],
                value: team[field],
              });
            });
          });
          resolve(results);
        });
      })
    ),
    set: (jsonGraphArg) => (
      new Promise((resolve, reject) => {
        const teamsBySlug = jsonGraphArg.teamsBySlug;
        db.updateTeams(teamsBySlug).then((flag) => {
          if (!flag) {
            throw new Error('For unknown reasons updateTeams returned a non-true flag');
          }
          const results = [];
          _.forEach(teamsBySlug, (teamObject, slug) => {
            _.forEach(teamObject, (value, field) => {
              results.push({
                path: ['teamsBySlug', slug, field],
                value,
              });
            });
          });
          resolve(results);
        })
        .catch((e) => {
          reject(e);
        });
      })
    ),
  },
  {
    route: "teamsBySlug[{keys:slugs}]['authors'][{integers:indices}]",
    get: (pathSet) => (
      new Promise((resolve) => {
        db.teamAuthorQuery(pathSet.slugs).then((data) => {
          const results = [];
          _.forEach(data, (authorSlugArray, teamSlug) => {
            pathSet.indices.forEach((index) => {
              if (index < authorSlugArray.length) {
                results.push({
                  path: ['teamsBySlug', teamSlug, 'authors', index],
                  value: $ref(['authorsBySlug', authorSlugArray[index]]),
                });
              }
            });
          });
          resolve(results);
        });
      })
    ),
  },
  {
    route: "teamsBySlug['createTeam']",
    call: (callPath, args) => (
      new Promise((resolve) => {
        const teamObject = args[0];
        if (!(teamObject.hasOwnProperty('slug') && teamObject.hasOwnProperty('name'))) {
          throw new Error('When creating an team you must provide both name and slug');
        }
        db.addTeam(teamObject).then((flag) => {
          if (!flag) {
            throw new Error('For unknown reasons addTeam returned a non-true flag');
          }
          const results = [];
          _.forEach(teamObject, (value, field) => {
            results.push({
              path: ['teamsBySlug', teamObject.slug, field],
              value,
            });
          });
          resolve(results);
        });
      })
    ),
  },
];
