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

export function isVisible(selector, evaluateParent = false) {
  let element = document.querySelector(selector);
  if (evaluateParent) {
    element = element.parentNode;
  }
  return (
    element.style.width !== '0' &&
    element.style.width !== '0px' &&
    element.style.height !== '0' &&
    element.style.height !== '0px' &&
    element.style.display !== 'none'
  );
}
