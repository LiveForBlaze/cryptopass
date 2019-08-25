import { withFormik } from 'formik';
import Yup from 'yup';
import sessionHelper from '../../../../helpers/session-storage';

import { ONLY_LETTERS } from '../../../../constants.js';

export function AddressForm(form) {
  return withFormik({
    mapPropsToValues({
      country,
      city,
      address,
      fileAddr,
      fileAddrResult,
      sessionHlp,
      t,
      nextStep,
    }) {
      return {
        city: city || sessionHelper('city'),
        country: country || sessionHelper('country'),
        address: address || sessionHelper('address'),
        fileAddr: fileAddr || '',
        fileAddrResult: fileAddrResult || '0',
        sessionHlp,
        nextStep,
        t: t || undefined,
      };
    },
    validate: (values) => {
      const errors = {};
      const fileFieldNames = ['fileAddrResult'];

      fileFieldNames.forEach((name) => {
        if (!values[name]) {
          errors[name] = values.t('validations.A photo should not be empty');
        }
      });

      return errors;
    },
    validationSchema: values => Yup.object().shape({
      country: Yup.string()
        .required(values.t('validations.Should not be empty')),
      city: Yup.string()
        .required(values.t('validations.Should not be empty'))
        .matches(ONLY_LETTERS, values.t('validations.Please enter only letters')),
      address: Yup.string()
        .required(values.t('validations.Should not be empty')),
    }),
    handleSubmit(values) {
      values.nextStep(3);
      const thirdStep = document.getElementById('step3');
      setTimeout(() => {
        thirdStep.scrollIntoView();
      }, 200);
    },
  })(form);
}
