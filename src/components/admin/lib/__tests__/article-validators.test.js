import { hasNonHttpsURL, returnsFirstRelativeURL } from '../article-validators';

describe('hasNonHttpsURL', () => {
  it('Returns true if it finds an http (not s) link in an href', () => {
    expect(
      hasNonHttpsURL('<a href=\'http://www.w3schools.com\'> Title\'hello\'</a>')
    ).toBe(true);
    expect(
      hasNonHttpsURL(
        '<a href=\'http://www.w3schools.com/\' target=\'_blank\'>Visit W3Schools!</a>'
      )
    ).toBe(true);
  });
  it('Returns false if it finds an https in an href', () => {
    expect(
      hasNonHttpsURL('<a href=\'https://www.w3schools.com\'> Title\'hello\'</a>')
    ).toBe(false);
  });
  it('Returns true if it finds an http (not s) link in an img tag', () => {
    expect(
      hasNonHttpsURL('<img src=\'http://image.com\' alt=\'Mountain View\'>')
    ).toBe(true);
    expect(
      hasNonHttpsURL(
        '<img src=\'http://image.com\' alt=\'HTML tutorial\' style=\'width:42px;height:42px;border:0;\'>'
      )
    ).toBe(true);
  });
  it('Returns false if it finds an https in an img tag', () => {
    expect(
      hasNonHttpsURL('<img src=\'https://image.com\' alt=\'Mountain View\'>')
    ).toBe(false);
  });
  it('Returns false when encountering a url in the text that is not a link', () => {
    expect(hasNonHttpsURL('<p>http://www.google.com</p>')).toBe(false);
    expect(
      hasNonHttpsURL(
        '<a href=\'https://www.w3schools.com\'> Title\'http://www.google.com\'</a>'
      )
    ).toBe(false);
  });
});

describe('returnsFirstRelativeURL', () => {
  it('Returns null if an href has an absolute URL', () => {
    expect(
      returnsFirstRelativeURL(
        '<a href=\'http://www.w3schools.com\'>Visit W3Schools</a>'
      )
    ).toBe(null);
  });
  it('Returns the first relative url if an href does not have an absolute url', () => {
    expect(
      returnsFirstRelativeURL('<a href=\'www.w3schools.com\'>Title</a>')
    ).toBe('www.w3schools.com');
  });
  it('Returns null if an img tag does have an absolute url', () => {
    expect(
      returnsFirstRelativeURL(
        '<img src=\'https://image.com\' alt=\'Mountain View\'>'
      )
    ).toBe(null);
    expect(
      returnsFirstRelativeURL(
        '<img src=\'http://image.com\' alt=\'HTML tutorial\' style=\'width:42px;height:42px;border:0;\'>'
      )
    ).toBe(null);
  });
  it('Returns the first relative url if an image tag does not have an absolute url', () => {
    expect(
      returnsFirstRelativeURL('<img src=\'www.image.com\' alt=\'Mountain View\'>')
    ).toBe('www.image.com');
    expect(
      returnsFirstRelativeURL(
        '<img src=\'www.image.com\' alt=\'HTML tutorial\' style=\'width:42px;border:0;\'>'
      )
    ).toBe('www.image.com');
  });
  it('Returns null when encountering a url in the text that is not a link,', () => {
    expect(returnsFirstRelativeURL('<p>www.google.com</p>')).toBe(null);
    expect(
      returnsFirstRelativeURL(
        '<a href=\'http://www.w3schools.com\'>www.google.com</a>'
      )
    ).toBe(null);
  });
});
