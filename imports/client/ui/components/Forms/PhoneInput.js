// @flow
import React, { Component } from 'react';
import ReactPhoneInput from 'react-phone-input-2';
import { FastField } from 'formik';
import styled from 'styled-components';
import sessionHelper from '../../../helpers/session-storage';


const StyledPhoneContainer = styled.div`
  & .react-tel-input input.form-control {
    backgorund-color: #fff;
    border-color: #dedede;
    padding-left: 55px;
  }

  & .react-tel-input.is-error input.form-control {
    background-color: #ffcfcf;
    border-color: #ff7373;
  }
`;

/**
 * @pure: ?false
 * @hasTests: false
 */
type Props = {
  id?: string,
  name: string,
  placeholder?: string,
  disabled?: bool,
};

export class PhoneInput extends Component<Props> {
  static defaultProps = {
    id: null,
    placeholder: null,
    disabled: false,
  }

  handleChange = formik => (value) => {
    const { name } = this.props;

    formik.setFieldValue(name, value);
  }

  handleBlur = formik => () => {
    const { name } = this.props;
    formik.setFieldTouched(name, true);
  }

  render() {
    const {
      id,
      name,
      placeholder,
      disabled,
    } = this.props;

    return (
      <FastField
        name={name}
        // eslint-disable-next-line
        render={({ field, form }) => {
          const { touched, errors, values } = form;
          const value = values[name];
          const error = touched[name] && errors[name];
          const containerClass = error ? 'react-tel-input is-error' : 'react-tel-input';

          sessionStorage.setItem(name, value);

          if (!error) {
            sessionStorage.setItem(`${name}Valid`, '1');
          } else {
            sessionStorage.setItem(`${name}Valid`, '0');
          }

          return (
            <StyledPhoneContainer>
              <ReactPhoneInput
                id={id}
                name={field.name}
                value={value}
                autoComplete="off"
                placeholder={placeholder}
                onChange={this.handleChange(form)}
                onBlur={this.handleBlur(form)}
                disabled={disabled}
                defaultCountry={sessionHelper('country')}
                containerClass={containerClass}
              />
            </StyledPhoneContainer>
          );
        }}
      />
    );
  }
}
