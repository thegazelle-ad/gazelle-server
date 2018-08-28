/* eslint-disable global-require, import/no-dynamic-require, no-console */
// Mock the console methods
console.log = jest.fn();
console.warn = jest.fn();
console.error = jest.fn();

const hasStackTraceRegex = /\/src\/lib\/logger\.js:\d+:\d+\)$/m;

describe('logger', () => {
  let logger;
  let initializeLogger;
  let updateDisplayAlert;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetModules();
    ({ logger, initializeLogger, updateDisplayAlert } = require('../logger'));
  });

  it('throws when uninitialized', async () => {
    const uninitializedErrorMessage = 'The logger has yet to be initialized';
    await expect(logger.fatal('fatal error')).rejects.toThrow(
      uninitializedErrorMessage,
    );
    expect(logger.error).toThrow(uninitializedErrorMessage);
    expect(logger.warn).toThrow(uninitializedErrorMessage);
    expect(logger.debug).toThrow(uninitializedErrorMessage);
  });

  it('calls console.error with error object in logger.error', () => {
    initializeLogger(false);
    logger.error('some error');

    expect(console.error).toHaveBeenCalled();
    expect(console.error.mock.calls[0][0]).toBeInstanceOf(Error);
    expect(console.error.mock.calls[0][0].message).toBe('some error');
    expect(console.error.mock.calls[0][0].stack).toMatch(
      /\/src\/lib\/logger\.js:\d+:\d+\)$/m,
    );
  });

  it('calls console.warn with error object in logger.warn', () => {
    initializeLogger(false);
    logger.warn('some warning');

    expect(console.warn).toHaveBeenCalled();
    expect(console.warn.mock.calls[0][0]).toBe('some warning');
  });

  it('calls console.log with error object in logger.debug', () => {
    initializeLogger(false);
    logger.debug('some debug statement');

    expect(console.log).toHaveBeenCalled();
    expect(console.log.mock.calls[0][0]).toBe('some debug statement');
  });

  it('calls console.error and exits on fatal serverside error', () => {
    // Mock process.exit
    global.process.exit = jest.fn();

    initializeLogger(false);
    logger.fatal('fatal error');

    expect(console.error).toHaveBeenCalledTimes(2);
    expect(console.error.mock.calls[1][0]).toBeInstanceOf(Error);
    expect(console.error.mock.calls[1][0].message).toBe('fatal error');
    expect(console.error.mock.calls[1][0].stack).toMatch(hasStackTraceRegex);
    expect(process.exit).toHaveBeenCalledWith(1);
  });

  it('calls given displayAlert and window.location.reload on fatal clientside error', async () => {
    // Mock reload and a display alert function
    window.location.reload = jest.fn();
    const mockDisplayAlert = jest.fn();

    initializeLogger(true, mockDisplayAlert);
    await logger.fatal('fatal error');

    expect(mockDisplayAlert).toHaveBeenCalledTimes(1);
    expect(typeof mockDisplayAlert.mock.calls[0][0]).toBe('string');
    expect(window.location.reload).toHaveBeenCalledWith(true);
  });

  it('correctly updates displayAlert function', async () => {
    // Mock reload and a display alert function
    window.location.reload = jest.fn();
    const mockDisplayAlert = jest.fn();

    initializeLogger(true, () => undefined);
    updateDisplayAlert(mockDisplayAlert);
    await logger.fatal('fatal error');

    expect(mockDisplayAlert).toHaveBeenCalledTimes(1);
    expect(window.location.reload).toHaveBeenCalledWith(true);
  });

  it("doesn't break non-fatal functions updating displayAlert", () => {
    initializeLogger(true, () => undefined);
    updateDisplayAlert(() => undefined);

    // Just a simple test to give some confidence it doesn't completely break things
    logger.debug('debug');
    logger.warn('warning');
    logger.error('error');

    expect(console.log).toHaveBeenCalledTimes(1);
    expect(console.warn).toHaveBeenCalledTimes(1);
    expect(console.error).toHaveBeenCalledTimes(1);
  });
});
