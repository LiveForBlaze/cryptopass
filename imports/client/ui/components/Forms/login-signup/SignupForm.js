// @flow
import React from 'react';
import { translate } from 'react-i18next';
import { FormikConsumer } from 'formik';
import { Form, Header, Grid, Button } from 'semantic-ui-react';
import { SignupForm as SignupFormFormik } from '../formik-ui/SignupForm';
import { FormHOC } from '../FormHOC';
import { Field } from '../Field';
import { StyledSegment } from '../StyledFormComponents';

const SignupForm = ({
  handleSubmit,
  toggleForm,
  hide,
  t,
  registerFormik,
}) => (
  !hide &&
  <FormikConsumer>
    {
      (formik) => {
        registerFormik(formik);
        return (
          <StyledSegment padded>
            <Form onSubmit={handleSubmit} autoComplete="off">
              <Header as="h2">
                {t('login.Sign up')}
              </Header>
              <Grid>
                <Grid.Column width={16}>
                  <Field
                    label={t('identity.First Name')}
                    name="firstName"
                    placeholder={t('identity.First Name')}
                  />
                </Grid.Column>
                <Grid.Column width={16}>
                  <Field
                    label={t('identity.Last Name')}
                    name="lastName"
                    placeholder={t('identity.Last Name')}
                  />
                </Grid.Column>
                <Grid.Column width={16}>
                  <Field
                    label={t('login.Email')}
                    name="email"
                    placeholder={t('login.Email')}
                  />
                </Grid.Column>
                <Grid.Column width={16}>
                  <Field
                    password
                    label={t('login.Password')}
                    name="pwd"
                    placeholder={t('login.Password')}
                  />
                </Grid.Column>
                <Grid.Row columns={2}>
                  <Grid.Column>
                    <Button color="blue" fluid type="submit">{t('login.Sign up')}</Button>
                  </Grid.Column>
                  <Grid.Column>
                    <Button basic color="yellow" fluid onClick={toggleForm}>{t('login.Login')}</Button>
                  </Grid.Column>
                </Grid.Row>
              </Grid>
            </Form>
          </StyledSegment>
        );
      }
    }
  </FormikConsumer>
);

export const SignupFormTranslated = translate('common')(FormHOC(SignupFormFormik(SignupForm)));
