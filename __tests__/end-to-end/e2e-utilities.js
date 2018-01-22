export function testPathServersideRender(nightmare, host, path, code = 200) {
  expect.assertions(1);
  return nightmare.goto(`${host}${path}`)
    .end()
    .then(result => {
      expect(result.code).toBe(code);
    });
}
