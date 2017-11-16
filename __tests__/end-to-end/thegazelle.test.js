import Nightmare from 'nightmare';

jest.setTimeout(1000 * 10); // 10 second time out limit for async tests

describe('The Gazelle server side rendering', () => {
  let nightmare = null;
  beforeEach(() => {
    nightmare = new Nightmare();
  });

  it('renders front page correctly', () => {
    expect.assertions(1);
    return nightmare.goto('http://localhost:3000')
      .end()
      .then(result => {
        expect(result.code).toBe(200);
      });
  });
});
