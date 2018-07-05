import fs from 'fs';
import crypto from 'crypto';

import {
  md5Hash,
  compressJPEG,
  deleteFile,
  copyFile,
} from 'lib/server-utilities';

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

describe('compressJPEG', () => {
  const filePath = './tmp/compression-test.jpg';

  beforeAll(() => {
    if (!fs.existsSync('./tmp')) fs.mkdirSync('./tmp');

    // Copy compressible JPEG to `./tmp` directory to simulate JPEG upload
    return copyFile(
      './src/lib/__tests__/assets/compression-test.jpg',
      filePath,
    );
  });

  /*
   * We know compression-test.jpg will compress because it is a plain white image
   * However, not all images will compress depending on the complexity of the images
   */
  it('compresses compressible JPEG', () => {
    expect.assertions(1);
    const uncompressedSize = fs.statSync(filePath).size;
    return compressJPEG(filePath).then(() => {
      const compressedSize = fs.statSync(filePath).size;
      expect(uncompressedSize).toBeGreaterThan(compressedSize);
    });
  });

  /* `./tmp/test.jpg` is already compressed from previous test */
  it("doesn't recompress already compressed JPEG", () => {
    expect.assertions(1);
    const oldCompressedSize = fs.statSync(filePath).size;
    return compressJPEG(filePath).then(() => {
      const newCompressedSize = fs.statSync(filePath).size;
      expect(newCompressedSize).toBe(oldCompressedSize);
    });
  });

  /* Clears `./tmp` directory after compression and upload to S3 */
  it('deletes JPEG', () => {
    expect.assertions(1);
    return deleteFile(filePath).then(() => {
      expect(fs.existsSync(filePath)).not.toBe(true);
    });
  });
});

describe('deleteFile', () => {
  const source = './src/lib/__tests__/assets/delete-test.txt';
  const target = './tmp/delete-test.txt';

  beforeAll(() => {
    if (!fs.existsSync('./tmp')) fs.mkdirSync('./tmp');
    return copyFile(source, target);
  });

  test('successfully deletes file', () => {
    expect.assertions(2);

    // Double check that file exists before deleting
    expect(fs.existsSync(target)).toBe(true);

    return deleteFile(target).then(() => {
      // Check that the same file no longer exists after `deleteFile()` resolves
      expect(fs.existsSync(target)).not.toBe(true);
    });
  });
});

describe('copyFile', () => {
  const source = './src/lib/__tests__/assets/copy-test.txt';
  const target = './tmp/copy-test.txt';

  beforeAll(() => {
    if (!fs.existsSync('./tmp')) fs.mkdirSync('./tmp');
    return copyFile(source, target);
  });

  it('copies file to new directory', () => {
    expect(fs.existsSync(target)).toBe(true);
  });

  it("does't remove the old file", () => {
    expect(fs.existsSync(source)).toBe(true);
  });

  it("doesn't copy a file that doesn't exist", () => {
    expect.assertions(1);
    const nonexistentSource = './not-a-real-path/nonexistent-file.test';
    const nonexistentTarget = './doesnt-exist/nonexistent-file.test';

    return expect(
      copyFile(nonexistentSource, nonexistentTarget),
    ).rejects.toEqual(Error('Source file does not exist.'));
  });

  // Cleanup
  afterAll(() => {
    deleteFile(target);
  });
});
