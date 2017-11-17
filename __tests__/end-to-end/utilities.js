import Nightmare from 'nightmare';

export function testPathServersideRender(host, path, name, code = 200) {
  const nightmare = new Nightmare();
  it(`renders ${name} page correctly`, () => {
    expect.assertions(1);
    return nightmare.goto(`${host}${path}`)
      .end()
      .then(result => {
        expect(result.code).toBe(code);
      });
  });
}

export const SIMPLE_TEST_TIMEOUT = 10 * 1000;
export const GAZELLE_HOST = 'http://localhost:3000';
export const ADMIN_HOST = 'http://localhost:4000';
