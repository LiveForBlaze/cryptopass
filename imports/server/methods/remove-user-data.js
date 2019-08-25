import { Meteor } from 'meteor/meteor';
import fs from 'fs';

Meteor.methods({
  removeUserData({ userFolder }) {
    const dirPath = `./../../../../../app/${userFolder}`;
    const files = fs.readdirSync(dirPath);
    if (files.length > 0) {
      for (let i = 0; i < files.length; i += 1) {
        const filePath = `${dirPath}/${files[i]}`;
        fs.unlinkSync(filePath);
      }
    }
  },
});
