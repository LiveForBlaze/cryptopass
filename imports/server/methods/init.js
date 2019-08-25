import { Meteor } from 'meteor/meteor';
import fs from 'fs';

Meteor.methods({
  init() {
    const appDir = './../../../../../app';
    const dirNames = ['extracted', 'private', 'private/uploads', 'private/images'];

    dirNames.forEach((name) => {
      const dir = `${appDir}/${name}`;
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
      }
    });
  },
});
