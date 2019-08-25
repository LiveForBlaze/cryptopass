import { Meteor } from 'meteor/meteor';
import { devprint } from '../../api/helpers';

Meteor.methods({
  sendVerificationLink({ userId }) {
    if (!userId) {
      return;
    }

    try {
      Accounts.sendVerificationEmail(userId);
    } catch (err) {
      devprint('sendVerificationEmail error');
    }
  },
});
