export const clearData = function (dir) {
  const userId = dir !== 'private/uploads' ? Meteor.userId() : '/images';
  Meteor.call('removeUserData', { userFolder: `${dir}/${userId}` });
};
