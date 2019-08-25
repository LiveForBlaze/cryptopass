import { Meteor } from 'meteor/meteor';

APIKeys = new Meteor.Collection('api-keys');
/*
* Allow
*/
APIKeys.allow({
  insert() {
    // Disallow inserts on the client by default.
    return false;
  },
  update() {
    // Disallow updates on the client by default.
    return false;
  },
  remove() {
    // Disallow removes on the client by default.
    return false;
  },
});

/*
* Deny
*/

APIKeys.deny({
  insert() {
    // Deny inserts on the client by default.
    return true;
  },
  update() {
    // Deny updates on the client by default.
    return true;
  },
  remove() {
    // Deny removes on the client by default.
    return true;
  },
});
