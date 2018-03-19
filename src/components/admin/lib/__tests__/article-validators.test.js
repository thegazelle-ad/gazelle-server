import { checkForHttp, checkForAbsoluteUrlRegex } from '../article-validators';

describe('Finds http/https in url', () => {
  it('Returns true if it finds an http (not s) link ', () => {
    expect(checkForHttp('https://www.google.com')).toEqual(true); // if the function returns true, the url is correct
    expect(checkForHttp('http://www.google.com')).toEqual(false);
    expect(checkForHttp('http')).toEqual(false);
    expect(checkForHttp('https')).toEqual(false); // need to be fixed
  });
  it('Returns true if it finds a URL that is in non-absolute format. ', () => {
    expect(checkForAbsoluteUrlRegex('www.google.com')).toEqual(false);
    expect(checkForAbsoluteUrlRegex('http://www.google.com')).toEqual(false); // if the function returns true, the url is correct.
    expect(checkForAbsoluteUrlRegex('<a href="https://www.w3schools.com">Visit W3Schools</a>')).toEqual(true);
    expect(checkForAbsoluteUrlRegex('https://www.google.com')).toEqual(false); // function needs to be fixed to make this work
    expect(checkForAbsoluteUrlRegex('https')).toEqual(false);
    expect(checkForAbsoluteUrlRegex('http')).toEqual(false);
    expect(checkForAbsoluteUrlRegex('www.https')).toEqual(false);
  });
});
