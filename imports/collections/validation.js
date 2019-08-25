import { Meteor } from 'meteor/meteor';

Validation = new Meteor.Collection('validation');

Validation.allow({
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

Validation.deny({
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
