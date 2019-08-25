// @flow
import { Meteor } from 'meteor/meteor';

const Env = {
  isDev: Meteor.isDevelopment,
  isProd: Meteor.isProduction,
  isClient: Meteor.isClient,
  isServer: Meteor.isServer,
};

export default Env;
