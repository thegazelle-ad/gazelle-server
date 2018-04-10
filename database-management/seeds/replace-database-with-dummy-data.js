const {
  deleteExistingData,
  addDummyArticles,
  addDummyCategories,
  addDummyInfoPages,
} = require('./lib/index');

exports.seed = async knex => {
  const numArticles = 50;
  const numCategories = 4;
  await deleteExistingData(knex);
  await addDummyArticles(knex, numArticles);
  await addDummyCategories(knex, numCategories);
  await addDummyInfoPages(knex);
};
