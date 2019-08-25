// @flow
import React from 'react';
import styled from 'styled-components';
import { translate } from 'react-i18next';
import { withRouter } from 'react-router';
import { LoginSignupWrapper } from './Forms/login-signup/LoginSignupWrapper';

const StyledLoginSignupWrapper = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  flex-direction: column;
`;

const StyledSpacer = styled.div`
  flex-grow: 1;
`;

// todo-2: write component tests
// Impure?:
export const Login = () => (
  <StyledLoginSignupWrapper>
    <StyledSpacer />
    <LoginSignupWrapper />
    <StyledSpacer />
  </StyledLoginSignupWrapper>
);

export const LoginTranslated = withRouter(translate('common')(Login));
