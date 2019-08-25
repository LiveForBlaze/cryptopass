import { Meteor } from 'meteor/meteor';
import '../../collections/validation';

Meteor.methods({
  getData() {
    const pendingUsers = Validation.find({ validationStatus: 'pending' }).fetch();
    return pendingUsers;
  },
});

Meteor.methods({
  getUserData({ userDb }) {
    const resp = Validation.findOne(userDb.userId);
    return resp;
  },
});

Meteor.methods({
  getMeteorData({ userId }) {
    Meteor.users.findOne({ _id: userId });
    const response = Meteor.users.findOne({ _id: userId });
    return response;
  },
});
