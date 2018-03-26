import { hasHttpsURL, returnsFirstRelativeURL } from '../article-validators';

describe('Finds http (not s) in url', () => {
  it('Returns false if it finds an http (not s) link ', () => {
    expect(hasHttpsURL('<a href="http:www.w3schools.com"> Title"hello"</a>')).toBe(false);
    expect(hasHttpsURL('<a href="https:www.w3schools.com"> Title"hello"</a>')).toBe(true);
    expect(hasHttpsURL('<img src="https://image.com" alt="Mountain View">')).toBe(true);
    expect(hasHttpsURL('<img src="http://image.com" alt="Mountain View">')).toBe(false);
  });
});

  describe("Returns first relative URL in the article's html", () => {
    it('Returns null if the URLs are absolute and the url if they are not.', () => {
      expect(returnsFirstRelativeURL('<a href="www.w3schools.com">Title</a>')).toBe('www.w3schools.com');
      expect(returnsFirstRelativeURL('<a href="http://www.w3schools.com">Visit W3Schools</a>')).toBe(null);
      expect(returnsFirstRelativeURL('<img src="https://image.com" alt="Mountain View">')).toBe(null);
      expect(returnsFirstRelativeURL('<img src="www.image.com" alt="Mountain View">')).toBe('www.image.com');
      expect(returnsFirstRelativeURL('<a href="https://www.w3schools.com">Visit W3Schools</a>')).toBe(null);
    });
  });
