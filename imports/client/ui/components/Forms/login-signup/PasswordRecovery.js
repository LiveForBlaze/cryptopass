// @flow
import React, { Component } from 'react';
import styled from 'styled-components';
import { Meteor } from 'meteor/meteor';
import { translate } from 'react-i18next';
import { Form, Header, Grid, Button } from 'semantic-ui-react';
import { withFormik } from 'formik';
import Yup from 'yup';
import { Field } from '../Field';

const StyledForm = styled(Form)`
  display: ${props => props.display || 'flex'};
  flex-direction: column;
  flex-wrap: wrap;
  margin-bottom: 50px;
  padding: 20px;
  background: #eee;
  width: 380px;
  border-radius: 10px;
`;

/**
 * @pure: ?true
 * @hasTests: false
 */
function PasswordRecoveryInnerFormHOC(WrappedComponent) {
  return class Container extends Component {
    state = {
      sent: false,
    }
    handleSent = () => {
      this.setState({
        sent: !this.state.sent,
      });
    }
    render() {
      const props = {
        ...this.props,
        ...this.state,
        sent: this.state.sent,
        handleSent: this.handleSent,
      };
      return <WrappedComponent {...props} />;
    }
  };
}

const PasswordRecoveryInnerForm = ({
  handleSubmit,
  t,
  sent,
}) => (
  <StyledForm onSubmit={handleSubmit} autoComplete="off">
    <Header as="h2">{t('login.Password recovery')}</Header>
    {
            !sent ? (
              <div>
                <p>{t('login.Enter your email address and we will send you a link to reset your password')}</p>
                <Grid>
                  <Grid.Column width={16}>
                    <Field
                      label={t('login.Email')}
                      name="email"
                      placeholder={t('login.Email')}
                    />
                  </Grid.Column>
                  <Grid.Column textAlign="center" width={16} columns={2}>
                    <Button color="blue" type="submit">{t('login.Reset password')}</Button>
                  </Grid.Column>
                </Grid>
              </div>
            ) :
            (
              <p>
                {t('login.We have sent you an email with a link to reset your password Please check your email')}
              </p>
            )
          }
  </StyledForm>

);


const PasswordRecovery = withFormik({
  mapPropsToValues({
    email, t, sent, handleSent,
  }) {
    return {
      email: email || '',
      t: t || undefined,
      sent,
      handleSent,
    };
  },
  validationSchema: values => Yup.object().shape({
    email: Yup.string()
      .required(values.t('validations.Should not be empty'))
      .email(values.t('validations.Invalid email address')),
  }),
  handleSubmit({
    email, t, handleSent,
  }, { setErrors }) {
    Meteor.call('checkEmail', { email }, (error, response) => {
      if (response) {
        Accounts.forgotPassword({ email });
        handleSent();
      } else {
        setErrors({ email: t('login.Account does not exist') });
      }
    });
  },
})(PasswordRecoveryInnerForm);

export const PasswordRecoveryTranslated = translate('common')(PasswordRecoveryInnerFormHOC(PasswordRecovery));
