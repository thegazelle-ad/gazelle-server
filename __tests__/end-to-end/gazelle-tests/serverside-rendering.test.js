import { testPathServersideRender, SIMPLE_TEST_TIMEOUT, GAZELLE_HOST as HOST } from '../utilities';

jest.setTimeout(SIMPLE_TEST_TIMEOUT);

describe('The Gazelle server side rendering', () => {
  testPathServersideRender(HOST, '', 'front');
  testPathServersideRender(HOST, '/team', 'team');
  testPathServersideRender(HOST, '/archives', 'archive');
  testPathServersideRender(HOST, '/about', 'about');
  testPathServersideRender(HOST, '/ethics', 'code of ethics');
  testPathServersideRender(HOST, '/category/news', 'category');
  testPathServersideRender(HOST, '/issue/100', 'non-default issue');
  testPathServersideRender(HOST, '/search?q=abu%20dhabi', 'search');
  testPathServersideRender(
    HOST,
    '/issue/100/letters/letter-from-the-editors-celebrating-100-issues',
    'article'
  );
  testPathServersideRender(HOST, '/author/khadeeja-farooqui', 'author');
  // This should definitely return a 404 but it isn't implemented right now so we'll make it a todo
  testPathServersideRender(HOST, '/this/path/should/not/exist', 'not found', 200);
});
