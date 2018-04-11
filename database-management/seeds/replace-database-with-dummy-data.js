const {
  deleteExistingData,
  addDummyArticles,
  addDummyCategories,
  addDummyInfoPages,
  addDummyStaff,
  addDummyTeams,
  addDummyTags,
  addDummyIssues,
  addDummySemesters,
  addIssueCategoryOrdering,
  addArticleTagRelationship,
  addArticleAuthorRelationship,
} = require('./lib/index');

exports.seed = async knex => {
  const numArticles = 50;
  const numCategories = 4;
  const numStaff = 10;
  const numTeams = 5;
  const numTags = 10;
  const numIssues = 2;
  const numSemesters = 1;
  await deleteExistingData(knex);
  // We parallelize in batches of independant jobs with jobs
  // that rely on it, being placed in the next batch
  await Promise.all([
    addDummyCategories(knex, numCategories),
    addDummyInfoPages(knex),
    addDummyTeams(knex, numTeams),
    addDummyTags(knex, numTags),
    addDummyIssues(knex, numIssues),
    addDummySemesters(knex, numSemesters),
  ]);
  await Promise.all([
    addDummyArticles(knex, numArticles, numCategories),
    addDummyStaff(knex, numStaff, numTeams),
    addIssueCategoryOrdering(knex, numIssues, numCategories),
  ]);
  await Promise.all([
    addArticleTagRelationship(knex, numArticles, numTags),
    addArticleAuthorRelationship(knex, numArticles, numStaff),
  ]);

  // Note that we have purposefully not added dummy interactive articles at this time
};
