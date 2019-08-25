// @flow
import React from 'react';
import { LoginFormTranslated } from './LoginForm';
import { SignupFormTranslated } from './SignupForm';

export class LoginSignupWrapper extends React.Component {
  state = {
    activeForm: 'Login',
  };
  toggleForm = (e) => {
    e.preventDefault();
    const nextState = this.state.activeForm === 'Login' ? 'Signup' : 'Login';
    this.setState({
      activeForm: nextState,
    });
  };

  render() {
    return this.state.activeForm === 'Login' ? (
      <LoginFormTranslated toggleForm={this.toggleForm} />
    ) : (
      <SignupFormTranslated toggleForm={this.toggleForm} />
    );
  }
}
