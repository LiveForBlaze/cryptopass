/*
* Methods: Insert - API Key
* Creates the users API key.
*/

Meteor.methods({
  initApiKey: (userId) => {
    check(userId, Match.OneOf(Meteor.userId(), String));
    const newKey = Random.hexString(32);
    try {
      return APIKeys.insert({
        owner: userId,
        key: newKey,
      });
    } catch (exception) {
      return exception;
    }
  },
});
