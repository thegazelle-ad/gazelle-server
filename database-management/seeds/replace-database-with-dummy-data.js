const { deleteExistingData } = require('./lib/delete-existing-data');

exports.seed = async knex => {
  await deleteExistingData(knex);
};
