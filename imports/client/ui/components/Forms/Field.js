// @flow
import React, { Component } from 'react';
import classNames from 'classnames';
import { FastField } from 'formik';
import styled from 'styled-components';
import { Form } from 'semantic-ui-react';
import shortid from 'shortid';
import { ErrorLabelTranslated as ErrorLabel } from './ErrorLabel';
import { DatePickerTranslated as DatePicker } from './DatePicker';
import { PhoneInput } from './PhoneInput';
import { PasswordInput } from './PasswordInput';
import { Input } from './Input';
import { InputFileTranslated as InputFile } from './InputFile';
import { CountriesDropdownTranslated as CountriesDropdown } from './Dropdown';

export const StyledLabel = styled.label`
  .ui.form .field > & {
    font-weight: bold;
  }

  .ui.form .field > &.fade {
    color: rgba(0, 0, 0, .3);
  }
`;

/**
 * @pure: ?false
 * @hasTests: false
 */
type
Props = {
  id?: string,
  label?: string,
  name: string,
  className?: string,
  placeholder?: string,
  disabled?: bool,
  minDate?: string,
  maxDate?: string,
  phone?: bool,
  password?: bool,
  datepicker?: bool,
  country?: bool,
  file?: bool,
  editable?: bool,
  loading?: bool,
  onChange?: () => {
  },
};

export class Field extends Component<Props> {
  id = shortid.generate();

  static defaultProps = {
    id: null,
    label: null,
    className: null,
    placeholder: null,
    disabled: false,
    maxDate: null,
    minDate: null,
    phone: false,
    password: false,
    datepicker: false,
    country: false,
    editable: true,
    loading: false,
    onChange: null,
  }

  render() {
    const {
      id,
      label,
      name,
      className,
      placeholder,
      disabled,
      minDate,
      maxDate,
      phone,
      password,
      datepicker,
      country,
      editable,
      loading,
      onChange,
      file,
    } = this.props;

    const inputId = id || this.id;

    return (
      <FastField
        name={name}
        // eslint-disable-next-line
        render={({ field, form }) => {
          const { touched, errors } = form;
          const error = touched[name] && errors[name];

          const typeId =
            !editable && 'not-editable' ||
            phone && 'phone' ||
            password && 'password' ||
            datepicker && 'datepicker' ||
            file && 'file' ||
            country && 'country';

          const control = ((type) => {
            switch (type) {
              case 'not-editable':
                return (
                  <Input
                    name={field.name}
                    id={inputId}
                    placeholder={placeholder}
                    disabled={disabled}
                    readOnly
                    loading={loading}
                  />
                );
              case 'phone':
                return (
                  <PhoneInput
                    name={field.name}
                    id={inputId}
                    placeholder={placeholder}
                    disabled={disabled}
                  />
                );
              case 'password':
                return (
                  <PasswordInput
                    name={field.name}
                    id={inputId}
                    placeholder={placeholder}
                    disabled={disabled}
                  />
                );
              case 'datepicker':
                return (
                  <DatePicker
                    name={field.name}
                    placeholder={placeholder}
                    disabled={disabled}
                    minDate={minDate}
                    maxDate={maxDate}
                  />
                );
              case 'country':
                return (
                  <CountriesDropdown
                    name={field.name}
                    placeholder={placeholder}
                    disabled={disabled}
                    loading={loading}
                  />
                );
              case 'file':
                return (
                  <InputFile
                    name={field.name}
                    id={inputId}
                    placeholder={placeholder}
                    disabled={disabled}
                    onChange={onChange}
                  />
                );
              default:
                return (
                  <Input
                    name={field.name}
                    id={inputId}
                    placeholder={placeholder}
                    disabled={disabled}
                    loading={loading}
                  />
                );
            }
          })(typeId);

          return (
            <Form.Field
              className={className}
            >
              {
                label && (
                  <StyledLabel
                    htmlFor={inputId}
                    className={classNames({
                      fade: !editable,
                    })}
                  >
                    {label}
                  </StyledLabel>
                )
              }
              {control}
              {
                error && editable &&
                <div>
                  <ErrorLabel error={error} />
                </div>
              }
            </Form.Field>
          );
        }}
      />
    );
  }
}
