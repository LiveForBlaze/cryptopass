import { Meteor } from 'meteor/meteor';

const fs = require('fs');

Meteor.methods({
  readJSON({ userId }) {
    const dir = `./../../../../../app/extracted/${userId}`;
    const fileName = 'data.json';
    const fullPath = `${dir}/${fileName}`;

    if (!fs.existsSync(fullPath)) {
      return null;
    }

    return JSON.parse(fs.readFileSync(fullPath));
  },
});
