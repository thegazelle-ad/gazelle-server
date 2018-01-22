const SIMPLE_TEST_TIMEOUT = (process.env.CIRCLECI ? 20 : 10) * 1000;
jest.setTimeout(SIMPLE_TEST_TIMEOUT);
