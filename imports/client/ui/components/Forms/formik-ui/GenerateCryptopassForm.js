import { withFormik } from 'formik';
import Yup from 'yup';
import { MIN_LENGTH_PASSWORD_ZIP } from '../../../../constants';

export function GenerateCryptopassForm(form) {
  return withFormik({
    mapPropsToValues({
      pwd,
      t,
      sessionHlp,
    }) {
      return {
        pwd: pwd || '',
        t: t || undefined,
        sessionHlp,
      };
    },
    validationSchema: values => Yup.object().shape({
      pwd: Yup.string()
        .required(values.t('validations.Should not be empty'))
        .min(MIN_LENGTH_PASSWORD_ZIP, values.t(`validations.Should be at least ${MIN_LENGTH_PASSWORD_ZIP} characters long`)),
    }),
  })(form);
}
