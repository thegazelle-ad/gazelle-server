const SIMPLE_TEST_TIMEOUT = (process.env.CIRCLECI ? 30 : 10) * 1000;
jest.setTimeout(SIMPLE_TEST_TIMEOUT);
