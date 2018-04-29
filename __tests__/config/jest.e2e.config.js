const configBase = require('./jest.base.config.js');

module.exports = {
  ...configBase,
  testRegex: String.raw`.*/__tests__/end-to-end/.*\.test\.js$`,
  setupTestFrameworkScriptFile: '<rootDir>/__tests__/end-to-end/jest-setup.js',
};
