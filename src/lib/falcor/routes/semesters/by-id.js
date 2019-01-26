import * as db from 'lib/db';

export default [
  {
    route: "semesters['byId'][{keys:ids}]['id','name','date']",
    get: async pathSet => {
      const requestedFields = pathSet[3];
      const data = await db.simpleQuery(
        'semesters',
        'id',
        pathSet.ids,
        requestedFields,
      );
      const results = data
        .map(semester =>
          requestedFields.map(field => ({
            path: ['semesters', 'byId', semester.id, field],
            value: semester[field],
          })),
        )
        .flatten();
      return results;
    },
  }
]