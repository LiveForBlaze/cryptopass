// @flow
import React from 'react';
import { translate } from 'react-i18next';
import { FormikConsumer } from 'formik';
import { Form, Header, Grid, Button, Segment, Message } from 'semantic-ui-react';
import { LoginForm as LoginFormFormik } from '../formik-ui/LoginForm';
import { FormHOC } from '../FormHOC';
import { Field } from '../Field';
import { StyledSegment } from '../StyledFormComponents';

const LoginForm = ({
  handleSubmit,
  toggleForm,
  hide,
  t,
  errors,
  registerFormik,
}) => (
  !hide &&
  <FormikConsumer>
    {
      (formik) => {
        registerFormik(formik);
        return (
          <Segment.Group>
            <StyledSegment padded>
              <Form onSubmit={handleSubmit} autoComplete="off">
                <Header as="h2">
                  {t('login.Login')}
                </Header>
                <Grid>
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
                  <Grid.Column textAlign="left" width={16}>
                    <a href="/password-recovery" style={{ fontSize: '12px' }}>{t('login.Forgot password')}</a>
                  </Grid.Column>
                  <Grid.Row columns={2}>
                    <Grid.Column>
                      <Button color="blue" fluid type="submit">{t('login.Login')}</Button>
                    </Grid.Column>
                    <Grid.Column>
                      <Button basic color="yellow" fluid onClick={toggleForm}>{t('login.Sign up')}</Button>
                    </Grid.Column>
                  </Grid.Row>
                </Grid>
              </Form>
            </StyledSegment>
            {
              errors && errors.onServer &&
              <Message error attached="bottom">
                {t(`login.${errors.onServer}`)}
              </Message>
            }
          </Segment.Group>
        );
      }
    }
  </FormikConsumer>
);

export const LoginFormTranslated = translate('common')(FormHOC(LoginFormFormik(LoginForm)));
