const { deleteExistingData } = require('./lib/delete-existing-data');
const { addDummyArticles } = require('./lib/add-dummy-articles');

exports.seed = async knex => {
  const numArticles = 50;
  await deleteExistingData(knex);
  await addDummyArticles(knex, numArticles);
};
