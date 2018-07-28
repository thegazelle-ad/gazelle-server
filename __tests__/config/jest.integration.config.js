const configBase = require('./jest.base.config.js');

module.exports = {
  ...configBase,
  collectCoverageFrom: configBase.collectCoverageFrom.concat([
    '<rootDir>/src/**/*.sql.{js,ts}', // Only get coverage from knex code, this is the only thing unit tests don't check
  ]),
  // Only match integration tests
  testMatch: ['<rootDir>/src/**/__tests__/**/*.it.test.{js,jsx,ts,tsx}'],
};
