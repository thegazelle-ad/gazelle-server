const path = require('path');

module.exports = {
  rootDir: path.resolve(__dirname, '../..'),
  moduleFileExtensions: ['js', 'jsx'],
  moduleDirectories: ['node_modules', '<rootDir>/src', '<rootDir>'],
  testRegex: String.raw`.*/__tests__/.*\.test\.js$`,
};
