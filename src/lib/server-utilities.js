import fs from 'fs';
import crypto from 'crypto';

export function md5Hash(file) {
  const hashInstance = crypto.createHash('md5');
  // readFileSync in the syncronous version of readFile
  const fileContents = fs.readFileSync(file, 'utf8');
  return hashInstance.update(fileContents).digest('hex');
}
