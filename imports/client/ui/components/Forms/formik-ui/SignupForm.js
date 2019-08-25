// @flow
import { Meteor } from 'meteor/meteor';
import { withFormik } from 'formik';
import Yup from 'yup';

import { ONLY_LETTERS, MIN_LENGTH_USER_PASSWORD, USER_ID } from '../../../../constants';

export function SignupForm(form) {
  return withFormik({
    mapPropsToValues({
      firstName,
      lastName,
      email,
      pwd,
      t,
      sessionHlp,
    }) {
      return {
        firstName: firstName || '',
        lastName: lastName || '',
        email: email || '',
        pwd: pwd || '',
        t: t || undefined,
        sessionHlp,
      };
    },
    validationSchema: values => Yup.object().shape({
      firstName: Yup.string()
        .required(values.t('validations.Should not be empty'))
        .matches(ONLY_LETTERS, values.t('validations.Please enter only letters')),
      lastName: Yup.string()
        .required(values.t('validations.Should not be empty'))
        .matches(ONLY_LETTERS, values.t('validations.Please enter only letters')),
      email: Yup.string()
        .required(values.t('validations.Should not be empty'))
        .email(values.t('validations.Invalid email address')),
      pwd: Yup.string()
        .required(values.t('validations.Should not be empty'))
        .min(MIN_LENGTH_USER_PASSWORD, values.t(`validations.Should be at least ${MIN_LENGTH_USER_PASSWORD} characters long`)),
    }),
    handleSubmit({
      email,
      pwd: password,
      firstName,
      lastName,
      t,
    }, { setErrors }) {
      sessionStorage.clear();
      const signup = {
        firstName,
        lastName,
        email,
      };
      sessionStorage.setItem('signup', JSON.stringify(signup));
      Meteor.call('checkEmail', { email }, (error, response) => {
        if (response) {
          setErrors({ email: t('validations.Email has already been taken') });
        } else {
          Accounts.createUser({
            email,
            username: email,
            password,
            isAdmin: false,
            profile: {
              firstName,
              lastName,
            },
          });
          Meteor.call('sendVerificationLink', { userId: USER_ID });
        }
      });
      const username = {
        username: email,
      };
      sessionStorage.setItem('username', JSON.stringify(username));
    },
  })(form);
}
