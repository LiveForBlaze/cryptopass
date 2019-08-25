import { Meteor } from 'meteor/meteor';

PartnerUsersTemp = new Meteor.Collection('tempuserdata');
/*
* Allow
*/
PartnerUsersTemp.allow({
  insert() {
    // Disallow inserts on the client by default.
    return true;
  },
  update() {
    // Disallow updates on the client by default.
    return true;
  },
  remove() {
    // Disallow removes on the client by default.
    return true;
  },
});

/*
* Deny
*/

PartnerUsersTemp.deny({
  insert() {
    // Deny inserts on the client by default.
    return false;
  },
  update() {
    // Deny updates on the client by default.
    return false;
  },
  remove() {
    // Deny removes on the client by default.
    return false;
  },
});

/**
 * Remove records from teempuserdata created more than 24hrs ago
 * PartnerUsersTemp.rawCollection().dropIndex({"createdAt": 1}).catch((e => {console.log("failed to remove index");}));
 *  !dont forget to drop previous index if u"re going to change TTL value
 */
PartnerUsersTemp.rawCollection().createIndex({ createdAt: 1 }, { expireAfterSeconds: 18400 });
