import Nightmare from 'nightmare';

const HOST = 'http://localhost:3000';

jest.setTimeout(1000 * 10); // 10 second time out limit for async tests

describe('The Gazelle server side rendering', () => {
  let nightmare = null;
  beforeEach(() => {
    nightmare = new Nightmare();
  });

  const testPathServersideRender = (path, name, code = 200) => {
    it(`renders ${name} page correctly`, () => {
      expect.assertions(1);
      return nightmare.goto(`${HOST}${path}`)
        .end()
        .then(result => {
          expect(result.code).toBe(code);
        });
    });
  };

  testPathServersideRender('', 'front');
  testPathServersideRender('/team', 'team');
  testPathServersideRender('/archives', 'archive');
  testPathServersideRender('/about', 'about');
  testPathServersideRender('/ethics', 'code of ethics');
  testPathServersideRender('/category/news', 'category');
  testPathServersideRender('/issue/100', 'non-default issue');
  testPathServersideRender('/search?q=abu%20dhabi', 'search');
  testPathServersideRender(
    '/issue/100/letters/letter-from-the-editors-celebrating-100-issues',
    'article'
  );
  testPathServersideRender('/author/khadeeja-farooqui', 'author');
  // This should definitely return a 404 but it isn't implemented right now so we'll make it a todo
  testPathServersideRender('/this/path/should/not/exist', 'not found', 200);
});
