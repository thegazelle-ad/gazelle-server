const path = require('path');

module.exports = {
  rootDir: path.resolve(__dirname, '../..'),
  moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx'],
  moduleDirectories: ['node_modules', '<rootDir>/src', '<rootDir>'],
  transform: {
    [String.raw`^.*\.(t|j)sx?$`]: 'babel-jest',
  },
  // This is just the excludes, when extending the base you should specify which files you actually want coverage from by extending the array
  collectCoverageFrom: [
    '!**/__tests__/**/*',
    '!**/__mocks__/**/*',
    '!**/__snapshots__/**/*',
  ],
  coverageReporters: ['text-lcov'],
};
