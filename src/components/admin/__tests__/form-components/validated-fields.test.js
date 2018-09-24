import {
  hasHttps,
  cannotNull,
  shorterThanDbVarChar,
  isPrettySlug,
} from 'components/admin/form-components/validated-fields';

describe('hasHttps', () => {
  it('Returns proper error message for non https link.', () => {
    expect(hasHttps('http://www.w3schools.com')).toBe(
      'This url requires that you use https.',
    );
  });
  it('Returns null for https link.', () => {
    expect(hasHttps('https://www.w3schools.com')).toBe(null);
  });
});

describe('cannotNull', () => {
  it('Returns proper error message for null field.', () => {
    expect(cannotNull('')).toBe('This field must have an entry.');
  });
  it('Returns null for non-null links.', () => {
    expect(cannotNull('not null text')).toBe(null);
  });
});

describe('shorterThanDbVarChar', () => {
  it('Returns proper error message for fields longer than the cap.', () => {
    expect(
      shorterThanDbVarChar(
        'RYE9p5bdMt81iYXh4sGgZayBqGyW5bfUjzJGOmBPSg6DNlBXd6wspRGB8O24RHcxtu6S9tnsY1tYaHzAnNJwTD4iHuo0iTljDzpgjWAYjlWUXcqnUb0QEjjsQSvQwh81JqleKlkqKOEpxrlNiWtn3UUphSsN5pmNhJHvn4HQK02fvRaQ336ijraQa4LhgrUeMWKjAyfNyRrcswbDdJjDPQAfTQ1bAWYmxCk8MYT8uvNyb6ORw5VmJRrlA4FJztDQ',
      ),
    ).toBe(
      'The database restricts this field to a maximum value of 255 characters.',
    );
  });
  it('Returns null for strings under the length of the cap..', () => {
    expect(shorterThanDbVarChar('Reasonable length text')).toBe(null);
  });
});

describe('isPrettySlug', () => {
  it('Returns proper error message for null field.', () => {
    expect(isPrettySlug('Ugly Human Slug')).toBe(
      'This slug could cause errors in the URL, please use the format "your-slug-here".',
    );
  });
  it('Returns null for non-null links.', () => {
    expect(isPrettySlug('beautiful-computer-slug-4')).toBe(null);
  });
});
