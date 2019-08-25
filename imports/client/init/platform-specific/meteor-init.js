// @flow
// $FlowFixMe
import { Meteor } from 'meteor/meteor';
import React from 'react';
import { render } from 'react-dom';
import App from '../../ui/components/App';

// todo-2: write browser tests
// eslint-disable-next-line fp/no-nil
Meteor.startup(() => {
  Meteor.call('init');
  const appNode = document.querySelector('main');
  render(<App />, appNode);
});
