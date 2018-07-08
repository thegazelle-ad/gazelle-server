const configBase = require('./jest.base.config.js');

module.exports = {
  ...configBase,
  collectCoverageFrom: configBase.collectCoverageFrom.concat([
    '<rootDir>/src/**/*.{js,jsx,ts,tsx}',
    '!<rootDir>/src/**/*.sql.{js,ts}', // We don't test knex code in unit tests
  ]),
  // Only look in source folder and ignore integration tests
  testMatch: ['<rootDir>/src/**/__tests__/**/*.test.{js,jsx,ts,tsx}'],
  testPathIgnorePatterns: [String.raw`.*\.it\.test\.(j|t)sx?$`],
};
