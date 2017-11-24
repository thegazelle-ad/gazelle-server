export const ENTER_UNICODE = '\u000d';
export const SIMPLE_TEST_TIMEOUT = 10 * 1000;
const NIGHTMARE_ACTION_TIMEOUT = (process.env.CIRCLECI ? 4 : 2) * 1000;
export const NIGHTMARE_CONFIG = {
  waitTimeout: NIGHTMARE_ACTION_TIMEOUT,
  gotoTimeout: NIGHTMARE_ACTION_TIMEOUT,
  loadTimeout: NIGHTMARE_ACTION_TIMEOUT,
  executionTimeout: NIGHTMARE_ACTION_TIMEOUT,
  // This one decides whether nightmarejs actually opens a window for the browser it tests in
  show: process.env.ELECTRON_SHOW_DISPLAY === '1',
};
