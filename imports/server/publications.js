// @flow
import { Meteor } from 'meteor/meteor';
import '../collections/validation';

const Users = Meteor.users;

Meteor.publish('users', () => Users.find());
Meteor.publish('validation', () => Validation.find());

Meteor.publish(null, () => {
  const projection = {
    'profile.name': 1,
  };
  return Meteor.users.find(
    { },
    { fields: projection }
  );
});

Meteor.methods({
  updateUser(id, doc) {
    Users.update(id, { $set: doc }, (error) => {
      if (error) {
        throw new Meteor.Error(500, error.message);
      }
    });
    return true;
  },
});
