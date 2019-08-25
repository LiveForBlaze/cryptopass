// @flow
import React, { Component } from 'react';
import _ from 'lodash';
import sessionHelper from '../../../helpers/session-storage';
import { devprint } from '../../../../api/helpers';

export function FormHOC(WrappedComponent) {
  return class Container extends Component {
    state = {
      language: 'en',
    };

    registerFormik = (formik) => {
      this.formik = formik;
    };

    shouldComponentUpdate(nextProps) {
      const {
        i18n,
        isResetting,
      } = nextProps;

      if (
        i18n.language !== this.state.language
        && this.formik
      ) {
        const {
          values,
          setFieldTouched,
          touched,
          errors,
        } = this.formik;

        const valuesKeys = Object.keys(values);
        const errorsKeys = Object.keys(errors);

        _.forEach(valuesKeys, (field) => {
          if (!errorsKeys.includes(field)) {
            setFieldTouched(field, !touched[field]);
          }
        });

        devprint(this.formik);

        this.setState({ language: i18n.language });
      }

      if (
        isResetting
        && this.formik
      ) {
        this.formik.handleReset();
      }

      return true;
    }

    render() {
      const props = {
        ...this.props,
        ...this.state,
        sessionHlp: sessionHelper,
        registerFormik: this.registerFormik,
      };
      return <WrappedComponent {...props} />;
    }
  };
}
