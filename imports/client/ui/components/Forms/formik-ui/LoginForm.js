// @flow
import { Meteor } from 'meteor/meteor';
import { withFormik } from 'formik';
import Yup from 'yup';

export function LoginForm(form) {
  return withFormik({
    mapPropsToValues({
      email,
      pwd,
      t,
      sessionHlp,
    }) {
      return {
        email: email || sessionHlp('login', 'email'),
        pwd: pwd || '',
        t: t || undefined,
        sessionHlp,
      };
    },
    validationSchema: values => Yup.object().shape({
      email: Yup.string()
        .required(values.t('validations.Should not be empty'))
        .email(values.t('validations.Invalid email address')),
      pwd: Yup.string()
        .required(values.t('validations.Should not be empty')),
    }),
    handleSubmit({
      email,
      pwd,
      sessionHlp,
    }, {
      setErrors,
    }) {
      const login = {
        email,
      };
      sessionStorage.setItem('login', JSON.stringify(login));
      Meteor.loginWithPassword(email, pwd, (error) => {
        if (error) {
          setErrors({
            onServer: error.reason,
          });
        }
      });
      if (email !== sessionHlp('username', 'username')) {
        sessionStorage.clear();
      }
    },
  })(form);
}
