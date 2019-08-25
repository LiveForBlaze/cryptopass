import { Accounts } from 'meteor/accounts-base';

Meteor.methods({
  checkEmail({ email }) {
    return Accounts.findUserByEmail(email);
  },
});
