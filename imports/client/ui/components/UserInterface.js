// @flow
import React, { Component } from 'react';
import { translate } from 'react-i18next';
import { withRouter } from 'react-router';
import { Container, Grid } from 'semantic-ui-react';
import Delay from 'react-delay';
import { ToastContainer } from 'react-toastify';
import { IdentityVerificationFormTranslated } from './Forms/IdentityVerificationForm';
import { AddressVerificationFormTranslated } from './Forms/AddressVerificationForm';
import { PhoneVerificationFormTranslated } from './Forms/PhoneVerificationForm';
import { GenerateCryptopassTranslated } from './Forms/GenerateCryptopass';
import { LoginTranslated } from './Login';
import './UserInterface.css';

// todo-2: write component tests
// Impure?:
export class UserInterface extends Component {
  state = {
    step: 1,
    isResetting: false,
  };

  handleResetForms = () => {
    this.setState({
      isResetting: true,
    });
  };

  nextStep = (i) => {
    this.setState({
      step: i,
    });
  };

  render() {
    const {
      step, isResetting,
    } = this.state;
    const { user } = this.props;

    return (
      <div className="UserInterface" style={{ minHeight: '100%' }}>
        {user !== undefined && user ? (
          <div className="UserInterface">
            <Container>
              <Grid centered>
                <Grid.Column mobile={16} tablet={12} computer={10}>
                  <Delay wait={500}>
                    <IdentityVerificationFormTranslated
                      nextStep={this.nextStep}
                      userId={user ? user._id : ''}
                      isResetting={isResetting}
                    />
                    <AddressVerificationFormTranslated
                      nextStep={this.nextStep}
                      userId={user._id}
                      hide={step < 2}
                      isResetting={isResetting}
                    />
                    <PhoneVerificationFormTranslated
                      nextStep={this.nextStep}
                      userId={user._id}
                      hide={step < 3}
                      isResetting={isResetting}
                    />
                    <GenerateCryptopassTranslated
                      nextStep={this.nextStep}
                      user={user._id}
                      hide={step < 4}
                      isResetting={isResetting}
                      handleResetForms={this.handleResetForms}
                    />
                  </Delay>
                </Grid.Column>
              </Grid>
            </Container>
          </div>
        ) : user !== undefined && (
          <div className="UserInterface">
            <Container fluid>
              <Grid centered>
                <Grid.Column mobile={16} tablet={8} computer={7}>
                  <LoginTranslated />
                </Grid.Column>
              </Grid>
            </Container>
          </div>
        )}
        <ToastContainer />
      </div>
    );
  }
}

export const UserInterfaceTranslated = withRouter(translate('common')(UserInterface));
