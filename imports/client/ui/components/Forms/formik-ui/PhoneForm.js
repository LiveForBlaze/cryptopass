// @flow
import { withFormik } from 'formik';
import Yup from 'yup';
import sessionHelper from '../../../../helpers/session-storage';

import { MIN_LENGTH_PHONE_NUMBER } from '../../../../constants.js';

export function PhoneForm(form) {
  return withFormik({
    mapPropsToValues({
      phone,
      sessionHlp,
      t,
      nextStep,
    }) {
      return {
        phone: phone || sessionHelper('phone'),
        sessionHlp,
        nextStep,
        t: t || undefined,
      };
    },
    validationSchema: values => Yup.object().shape({
      phone: Yup.string()
        .required(values.t('validations.Should not be empty'))
        .min(MIN_LENGTH_PHONE_NUMBER, values.t(`validations.Should be at least ${MIN_LENGTH_PHONE_NUMBER} characters long`)),
    }),
    handleSubmit(values) {
      values.nextStep(4);
      const fourthStep = document.getElementById('step4');
      setTimeout(() => {
        fourthStep.scrollIntoView();
      }, 200);
    },
  })(form);
}
