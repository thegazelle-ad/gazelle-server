const { deleteExistingData } = require('./lib/delete-existing-data');
const { addDummyArticles } = require('./lib/add-dummy-articles');
const { addDummyCategories } = require('./lib/add-dummy-categories');

exports.seed = async knex => {
  const numArticles = 50;
  const numCategories = 4;
  await deleteExistingData(knex);
  await addDummyArticles(knex, numArticles);
  await addDummyCategories(knex, numCategories);
};
