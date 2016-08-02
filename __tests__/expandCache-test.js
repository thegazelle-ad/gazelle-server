jest.unmock('lib/falcor/falcorUtils');

import { expandCache } from 'lib/falcor/falcorUtils';
describe('expandCache', () => {
  it('does expand atoms', () => {
    let cache = {key: {$type: 'atom', value: [1, 2, 3]}};
    expect(expandCache(cache)).toEqual({key: [1, 2, 3]})
    expect(2).toBe(2);
  });
})