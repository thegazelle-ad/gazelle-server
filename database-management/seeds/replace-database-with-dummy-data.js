const {
  deleteExistingData,
  addDummyArticles,
  addDummyCategories,
  addDummyInfoPages,
  addDummyStaff,
  addDummyTeams,
} = require('./lib/index');

exports.seed = async knex => {
  const numArticles = 50;
  const numCategories = 4;
  const numStaff = 10;
  const numTeams = 5;
  await deleteExistingData(knex);
  // We parallelize in batches of independant jobs with jobs
  // that rely on it, being placed in the next batch
  await Promise.all([
    addDummyCategories(knex, numCategories),
    addDummyInfoPages(knex),
    addDummyTeams(knex, numTeams),
  ]);
  await Promise.all([
    addDummyArticles(knex, numArticles, numCategories),
    addDummyStaff(knex, numStaff, numTeams),
  ]);
};
