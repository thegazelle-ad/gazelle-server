/* eslint-disable global-require */
module.exports = {
  deleteExistingData: require('./delete-existing-data').deleteExistingData,
  addDummyArticles: require('./add-dummy-articles').addDummyArticles,
  addDummyCategories: require('./add-dummy-categories').addDummyCategories,
  addDummyInfoPages: require('./add-dummy-info-pages').addDummyInfoPages,
  addDummyStaff: require('./add-dummy-staff').addDummyStaff,
  addDummyTeams: require('./add-dummy-teams').addDummyTeams,
};
