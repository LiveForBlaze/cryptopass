// @flow
import * as React from 'react';
import styled from 'styled-components';
import { translate } from 'react-i18next';
import { Form, Header, Message } from 'semantic-ui-react';
import { Input } from './molecules/Input';

const StyledForm = styled(Form)`
  width: 380px;
`;

/**
 * @pure: ?true
 * @hasTests: false
 */
type Props = any;
type State = {
  oldPassword: string,
  password: string,
  confirmPassword: string,
  submitted: boolean,
  showErrorMessage: boolean,
  passwordValid: boolean,
  confirmPasswordValid: boolean,
  formValid: boolean,
};

export class NewPassword extends React.Component<Props, State> {
  state = {
    oldPassword: '',
    password: '',
    confirmPassword: '',
    submitted: false,
    showErrorMessage: false,
    formErrors: {
      password: '',
      confirmPassword: '',
    },
    passwordValid: false,
    confirmPasswordValid: false,
    formValid: false,
  };

  updatePassword = () => {
    const { formValid, oldPassword, password } = this.state;

    if (formValid) {
      Accounts.changePassword(oldPassword, password, (error, result) => {
        if (result === true) {
          this.setState({ submitted: true });
        } else if (error) {
          this.setState({ showErrorMessage: true });
        }
      });
    }
  };

  validateField = (fieldName, value) => {
    let { passwordValid, confirmPasswordValid } = this.state;
    const { password } = this.state;
    const fieldValidationErrors = this.state.formErrors;

    switch (fieldName) {
      case 'password':
        passwordValid = value.length >= 6;
        fieldValidationErrors.password = passwordValid ? '' : ' is invalid';
        break;
      case 'confirmPassword':
        confirmPasswordValid = (password === value);
        fieldValidationErrors.confirmPassword = confirmPasswordValid ? '' : ' is invalid';
        break;
      default:
        break;
    }

    this.setState(
      {
        formErrors: fieldValidationErrors,
        passwordValid,
        confirmPasswordValid,
      },
      this.validateForm
    );
  };

  validateForm = () => {
    const { passwordValid, confirmPasswordValid } = this.state;

    this.setState({
      formValid: passwordValid && confirmPasswordValid,
    });
  };

  handleOnChange = (e) => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
    this.validateField(name, value);
    this.setState({ showErrorMessage: false });
  };

  checkForm = () => new Promise((resolve) => {
    resolve();
  });

  handleSubmit = () => {
    this.checkForm()
      .then(() => {
        this.updatePassword();
      });
  };

  render() {
    const {
      oldPassword, password, confirmPassword, submitted, showErrorMessage, formValid, formErrors,
    } = this.state;
    const { t } = this.props;
    return (
      <StyledForm onSubmit={this.handleSubmit}>
        <Header as="h2">{t('newPassword.Change your password')}</Header>
        <Input
          label={t('newPassword.Old password')}
          type="password"
          name="oldPassword"
          value={oldPassword}
          onChange={this.handleOnChange}
        />
        <Input
          label={t('newPassword.New password')}
          type="password"
          name="password"
          value={password}
          warning={formErrors.password}
          onChange={this.handleOnChange}
        />
        <Input
          label={t('newPassword.Repeat password')}
          type="password"
          name="confirmPassword"
          value={confirmPassword}
          warning={formErrors.confirmPassword}
          onChange={this.handleOnChange}
        />
        {
          submitted &&
          <Message
            success
            header={t('newPassword.Your password has been changed')}
          />
        }
        {
          showErrorMessage &&
          <Message
            negative
            header={t('newPassword.Incorrect old password')}
          />
        }
        <Form.Button color="green" onClick={this.updatePassword} style={{ marginLeft: 'auto' }} disabled={!formValid}>
          {t('newPassword.Set new password')}
        </Form.Button>
      </StyledForm>
    );
  }
}

export const NewPasswordTranslated = translate('common')(NewPassword);
