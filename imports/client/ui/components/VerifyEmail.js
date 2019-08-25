import React from 'react';
import { Redirect } from 'react-router-dom';
import { devprint } from '../../../api/helpers';

export const VerifyEmail = ({ match }) => {
  Accounts.verifyEmail(match.params.token, (error) => {
    if (error) {
      devprint(error.reason);
    }
  });

  return (<Redirect to="/?from=verify-email" />);
};
