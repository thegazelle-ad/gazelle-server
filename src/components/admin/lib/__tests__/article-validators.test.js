import { isHttps, returnsURLifAbsolute } from '../article-validators';

describe('Finds http (not s) in url', () => {
  it('Returns false if it finds an http (not s) link ', () => {
    expect(isHttps('https://www.google.com')).toBe(true); // if the function returns true, the url is correct
    expect(isHttps('http://www.google.com')).toBe(false);
    expect(isHttps('http')).toBe(false);
    expect(isHttps('https')).toBe(false); // need to be fixed
  });
  it('Returns the URL if it finds a URL that is in non-absolute format. ', () => {
    expect(returnsURLifAbsolute('<a href="www.w3schools.com">Title</a>')).toBe('www.w3schools.com');
    expect(returnsURLifAbsolute('<a href="http://www.w3schools.com">Visit W3Schools</a>')).toBe(null); // if the function returns true, the url is correct.
    expect(returnsURLifAbsolute('<img src="https://image.com" alt="Mountain View">')).toBe(null);
    expect(returnsURLifAbsolute('<img src="www.image.com" alt="Mountain View">')).toBe('www.image.com');
    expect(returnsURLifAbsolute('<a href="https://www.w3schools.com">Visit W3Schools</a>')).toBe(null);
  });
});
