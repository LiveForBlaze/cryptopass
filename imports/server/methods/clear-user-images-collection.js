import { Meteor } from 'meteor/meteor';
import Images from '../../api/filesCollection';

Meteor.methods({
  clearImages({ userId }) {
    Images.remove({ userId });
  },
});

Meteor.methods({
  clearImage({ name, userId }) {
    Images.remove({ name, userId });
  },
});
