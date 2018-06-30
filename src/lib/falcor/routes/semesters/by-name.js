import falcor from 'falcor';
import _ from 'lodash';

import * as db from 'lib/db';

const $ref = falcor.Model.ref;

export default [
  {
    route:
      "semesters['byName'][{keys:semesterNames}][{integers:teamIndices}]['members'][{integers:memberIndices}]", // eslint-disable-line max-len
    get: pathSet =>
      new Promise((resolve, reject) => {
        if (pathSet.semesterNames.length !== 1) {
          throw new Error(
            "Didn't expect more than one semester in semesters byName",
          );
        }
        db.getSemesterMembers(
          pathSet.semesterNames[0],
          pathSet.teamIndices,
          pathSet.memberIndices,
        )
          .then(data => {
            const results = [];
            _.forEach(data, (teamObj, teamIndex) => {
              _.forEach(teamObj, (memberSlug, memberIndex) => {
                results.push({
                  path: [
                    'semesters',
                    'byName',
                    pathSet.semesterNames[0],
                    teamIndex,
                    'members',
                    memberIndex,
                  ], // eslint-disable-line max-len
                  value: $ref(['staff', 'bySlug', memberSlug]),
                });
              });
            });
            resolve(results);
          })
          .catch(reject);
      }),
  },
  {
    route:
      "semesters['byName'][{keys:semesterNames}][{integers:teamIndices}]['teamInfo']", // eslint-disable-line max-len
    get: pathSet =>
      new Promise((resolve, reject) => {
        if (pathSet.semesterNames.length !== 1) {
          throw new Error(
            "Didn't expect more than one semester in semesters byName",
          );
        }
        db.getSemesterTeams(pathSet.semesterNames[0], pathSet.teamIndices)
          .then(data => {
            const results = [];
            data.forEach(row => {
              results.push({
                path: [
                  'semesters',
                  'byName',
                  pathSet.semesterNames[0],
                  row.team_order,
                  'teamInfo',
                ], // eslint-disable-line max-len
                value: $ref(['teams', 'bySlug', row.teamSlug]),
              });
            });
            resolve(results);
          })
          .catch(reject);
      }),
  },
];
