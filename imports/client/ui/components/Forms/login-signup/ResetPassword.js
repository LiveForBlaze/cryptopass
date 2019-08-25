// @flow
import React, { Component } from 'react';
import styled from 'styled-components';
import { translate } from 'react-i18next';
import { withRouter } from 'react-router';
import { Form, Header, Grid, Button } from 'semantic-ui-react';
import { withFormik } from 'formik';
import Yup from 'yup';
import { Field } from '../Field';
import { devprint } from '../../../../../api/helpers';

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
function ResetPasswordInnerFormHOC(WrappedComponent) {
  return class Container extends Component {
    render() {
      const props = {
        ...this.props,
        ...this.state,
        token: this.props.token,
        redirect: this.props.history,
      };
      return <WrappedComponent {...props} />;
    }
  };
}

const ResetPasswordInnerForm = ({
  handleSubmit,
  t,
}) => (
  <StyledForm onSubmit={handleSubmit} autoComplete="off">
    <Header as="h2">{t('login.Password recovery')}</Header>
    <div>
      <p>{t('newPassword.Set new password')}</p>
      <Grid>
        <Grid.Column width={16}>
          <Field
            password
            label={t('login.Password')}
            name="pwd"
            placeholder={t('login.Password')}
          />
        </Grid.Column>
        <Grid.Column textAlign="center" width={16} columns={2}>
          <Button color="blue" type="submit">{t('newPassword.Set new password')}</Button>
        </Grid.Column>
      </Grid>
    </div>
  </StyledForm>
);


const ResetPassword = withFormik({
  mapPropsToValues({
    pwd, t, token, redirect,
  }) {
    return {
      pwd: pwd || '',
      t: t || undefined,
      token: token || undefined,
      redir: redirect,
    };
  },
  validationSchema: values => Yup.object().shape({
    pwd: Yup.string()
      .required(values.t('validations.Should not be empty'))
      .min(6, values.t('signup.Should be at least 6 characters long')),
  }),
  handleSubmit({
    pwd, token, redir,
  }) {
    Accounts.resetPassword(token, pwd, (error) => {
      if (error) {
        devprint(error.reason);
      } else {
        redir.push('/');
      }
    });
  },
})(ResetPasswordInnerForm);

export const ResetPasswordTranslated = withRouter(translate('common')(ResetPasswordInnerFormHOC(ResetPassword)));
