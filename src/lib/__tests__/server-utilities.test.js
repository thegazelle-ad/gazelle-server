import { md5Hash } from 'lib/server-utilities';
import crypto from 'crypto';

describe('md5Hash', () => {
  const indexHash = md5Hash('./src/index.js');
  it('returns a string', () => {
    expect(typeof indexHash).toBe('string');
  });

  it('hashes consistently', () => {
    const secondIndexHash = md5Hash('./src/index.js');
    expect(indexHash).toBe(secondIndexHash);
  });

  it('throws on invalid path', () => {
    expect(md5Hash.bind(null, './gibberish')).toThrow();
  });

  it('hashes different files differently', () => {
    const adminClientHash = md5Hash('./src/client-scripts/admin-client.js');
    expect(indexHash).not.toBe(adminClientHash);
  });

  it("doesn't just hash file names", () => {
    const fileName = './src/index.js';
    const hashInstance = crypto.createHash('md5');
    const fileNameHash = hashInstance.update(fileName).digest('hex');
    expect(fileNameHash).not.toBe(md5Hash(fileName));
  });
});
