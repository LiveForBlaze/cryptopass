// @flow
import { withFormik } from 'formik';
import Yup from 'yup';
import sessionHelper from '../../../../helpers/session-storage';

import { ONLY_LETTERS, DD_MM_YYYY } from '../../../../constants.js';

export function IdentityForm(form) {
  return withFormik({
    mapPropsToValues({
      firstName,
      lastName,
      dateOfBirth,
      placeOfBirth,
      citizenship,
      passport,
      issuedBy,
      issueDate,
      expiryDate,
      filePass,
      fileSelfie,
      filePassResult,
      fileSelfieResult,
      sessionHlp,
      email,
      t,
      nextStep,
    }) {
      return {
        firstName: firstName || sessionHelper('firstName'),
        lastName: lastName || sessionHelper('lastName'),
        dateOfBirth: dateOfBirth || sessionHelper('dateOfBirth'),
        placeOfBirth: placeOfBirth || sessionHelper('placeOfBirth'),
        passport: passport || sessionHelper('passport'),
        citizenship: citizenship || sessionHelper('citizenship'),
        issuedBy: issuedBy || sessionHelper('issuedBy'),
        issueDate: issueDate || sessionHelper('issueDate'),
        expiryDate: expiryDate || sessionHelper('expiryDate'),
        filePass: filePass || '',
        fileSelfie: fileSelfie || '',
        filePassResult: filePassResult || '0',
        fileSelfieResult: fileSelfieResult || '0',
        sessionHlp,
        nextStep,
        email,
        t: t || undefined,
      };
    },
    validate: (values) => {
      const errors = {};
      const dateFieldNames = ['dateOfBirth', 'issueDate', 'expiryDate'];
      const fileFieldNames = ['filePassResult', 'fileSelfieResult'];

      dateFieldNames.forEach((name) => {
        if (!values[name]) {
          errors[name] = values.t('validations.Should not be empty');
        } else if (!DD_MM_YYYY.test(values[name])) {
          errors[name] = values.t('validations.Specify the correct date');
        }
      });

      fileFieldNames.forEach((name) => {
        if (!values[name] || values[name] === '0') {
          errors[name] = values.t('validations.A photo should not be empty');
        }
      });

      return errors;
    },
    validationSchema: values => Yup.object().shape({
      firstName: Yup.string()
        .required(values.t('validations.Should not be empty'))
        .matches(ONLY_LETTERS, values.t('validations.Please enter only letters')),
      lastName: Yup.string()
        .required(values.t('validations.Should not be empty'))
        .matches(ONLY_LETTERS, values.t('validations.Please enter only letters')),
      placeOfBirth: Yup.string()
        .required(values.t('validations.Should not be empty'))
        .matches(ONLY_LETTERS, values.t('validations.Please enter only letters')),
      citizenship: Yup.string()
        .required(values.t('validations.Should not be empty')),
      passport: Yup.string()
        .required(values.t('validations.Should not be empty')),
      issuedBy: Yup.string()
        .required(values.t('validations.Should not be empty')),
    }),
    handleSubmit(values) {
      const username = {
        username: values.email,
      };
      sessionStorage.setItem('username', JSON.stringify(username));
      values.nextStep(2);
      const secondStep = document.getElementById('step2');
      setTimeout(() => {
        secondStep.scrollIntoView();
      }, 200);
    },
  })(form);
}
