import { Meteor } from 'meteor/meteor';

const crypto = require('crypto');

let algo = 'sha512';

Meteor.methods({
  getDataHash({ data, USER_ID }) {
    let dataIn = data;
    if (USER_ID) {
      algo = 'sha256';
      dataIn = USER_ID;
    }
    return crypto.createHash(algo).update(dataIn).digest('hex');
  },
});
