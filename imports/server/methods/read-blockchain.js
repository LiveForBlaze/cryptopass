import { Meteor } from 'meteor/meteor';
import '../../collections/validation';

Meteor.methods({
  readBlockchain({ userId }) {
    console.log('VALIDATION ID: ', userId);
    console.log('VALIDATION DATA:', Validation.findOne({ _id: userId.userId }));
    return Validation.findOne({ _id: userId.userId });
  },
});
