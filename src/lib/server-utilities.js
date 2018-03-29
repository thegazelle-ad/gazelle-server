import fs from 'fs';
import Promise from 'bluebird';

// md5Hash packages
import crypto from 'crypto';

// compressJPEG packages
import imagemin from 'imagemin';
import imageminJpegRecompress from 'imagemin-jpeg-recompress';

export function md5Hash(file) {
  const hashInstance = crypto.createHash('md5');
  // readFileSync in the syncronous version of readFile
  const fileContents = fs.readFileSync(file, 'utf8');
  return hashInstance.update(fileContents).digest('hex');
}

/*
 *  Compresses JPEG image passed as file path and overwrites uncompressed file
 *  Returns imagemin Promise
 */
export function compressJPEG(filePath) {
  const fileDirectory = filePath.substring(0, filePath.lastIndexOf('/'));
  return imagemin([filePath], fileDirectory, {
    plugins: [
      imageminJpegRecompress(true), // Favor accuracy over speed
    ],
  });
}

/* Deletes file passed as file path */
export const deleteFile = Promise.promisify(fs.unlink);

/*
 * Returns a promise for file copying by piping a read/write stream
 * Thanks to the fine folks on StackOverflow:
 * https://stackoverflow.com/questions/11293857/fastest-way-to-copy-file-in-node-js
 */
export function copyFile(source, target) {
  return new Promise((resolve, reject) => {
    fs.exists(source, doesExist => {
      if (doesExist) {
        const rd = fs.createReadStream(source);
        rd.on('error', error => {
          rd.destroy();
          reject(error);
        });

        const wr = fs.createWriteStream(target);
        wr.on('error', error => {
          wr.end();
          rd.destroy();
          reject(error);
        });

        wr.on('finish', resolve);
        rd.pipe(wr);
      } else {
        reject(new Error('Source file does not exist.'));
      }
    });
  });
}
