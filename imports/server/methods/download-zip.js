import { Meteor } from 'meteor/meteor';
import fs from 'fs-extra';
import fp from 'path';

Meteor.methods({
  downloadZip({ path }) {
    const buf = fs.readFileSync(path);

    fs.removeSync(path.replace(`${fp.sep}Cryptopass.zip`, ''));
    return buf;
  },
});
