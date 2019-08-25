import { Meteor } from 'meteor/meteor';

Meteor.methods({
  updateUserData({
    id, userId, identity, address, phone, zipHash, dataHash, validationStatus,
  }) {
    const data = {};
    const Id = id || userId;
    if (identity) {
      data.identity = identity;
    }

    if (address) {
      data.address = address;
    }

    if (phone) {
      data.phone = phone;
    }

    if (zipHash) {
      data.zipHash = zipHash;
    }

    if (dataHash) {
      data.dataHash = dataHash;
    }

    if (validationStatus) {
      data.validationStatus = validationStatus;
    }
    console.log('_id:', Id);
    Meteor.users.update({ _id: Id }, { $set: data });
  },
});
