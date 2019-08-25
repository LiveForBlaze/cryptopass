// @flow
import * as crypto from 'crypto';
import * as fs from 'fs';

export function hashFile(key: string) {
  // open file stream
  const filePath = Assets.absoluteFilePath('test.js');
  const readStream = fs.createReadStream(filePath);
  const hash = crypto.createHash('sha512', key);
  hash.setEncoding('hex');

  // once the stream is done, we read the values
  return new Promise((resolve) => {
    readStream.on('end', () => {
      hash.end();
      // print result
      resolve(hash.read());
      // pipe file to hash generator
      return null;
    });
    readStream.pipe(hash);
  });
}

export function hashText(text: string, key: string): string {
  const hash = crypto.createHmac('sha512', key);
  hash.update(text);
  return hash.digest('hex');
}
