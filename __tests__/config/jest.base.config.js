const path = require('path');

module.exports = {
  rootDir: path.resolve(__dirname, '../..'),
  moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx'],
  moduleDirectories: ['node_modules', '<rootDir>/src', '<rootDir>'],
  testRegex: String.raw`.*/__tests__/.*\.test\.(j|t)s$`,
  transform: {
    [String.raw`^.*\.(t|j)sx?$`]: 'babel-jest',
  },
};
