export const logger = {
  fatal: jest.fn().mockResolvedValue(undefined),
  error: jest.fn(),
  warn: jest.fn(),
  debug: jest.fn(),
};

logger.__mockClear = () => {
  logger.fatal.mockClear();
  logger.error.mockClear();
  logger.warn.mockClear();
  logger.debug.mockClear();
};
