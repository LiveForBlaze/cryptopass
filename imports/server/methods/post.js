import { Meteor } from 'meteor/meteor';
import { devprint } from '../../api/helpers';

Meteor.methods({
  sendData({
    id, userId, identity, address, phone, dataHash, zipHash, validationStatus,
  }) {
    const apiPath = !validationStatus ? 'https://check.cryptopass.id/api/check' : 'https://get.cryptopass.id/api/return';
    devprint(apiPath);
    let sendingData = '';
    if (validationStatus) {
      sendingData = {
        api_key: 'testKey',
        id,
        validationStatus,
      };
    } else {
      const { username } = Meteor.users.findOne(userId);
      sendingData = {
        api_key: 'testKey',
        id: userId,
        username,
        identity,
        address,
        phone,
        dataHash,
        zipHash,
      };
    }
    try {
      HTTP.call('POST', apiPath, {
        data: sendingData,
      }, (error, response) => {
        if (error) {
          devprint(`post failed: ${error}`);
        } else if (!response) {
          devprint(`invalid post response: ${typeof response}`);
        } else {
          devprint(`post response: ${response}`);
        }
      });
      return true;
    } catch (e) {
      devprint(e);
      // Got a network error, timeout, or HTTP error in the 400 or 500 range.
      return false;
    }
  },
});
