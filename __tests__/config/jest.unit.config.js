const configBase = require('./jest.base.config.js');

module.exports = {
  ...configBase,
  testPathIgnorePatterns: [
    '<rootDir>/node_modules/',
    '<rootDir>/__tests__/end-to-end/',
  ],
};
