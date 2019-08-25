// @flow
import React from 'react';
import { FastField } from 'formik';
import { PasswordInput as SemanticPasswordInput } from './molecules/PasswordInput';

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

export function PasswordInput({
  id,
  name,
  placeholder,
  disabled,
}: Props): React.Node {
  return (
    <FastField
      name={name}
      // eslint-disable-next-line
      render={({ field, form }) => {
        const {
          touched,
          errors,
          values,
          handleChange,
          handleBlur,
        } = form;
        const value = values[name];
        const error = touched[name] && errors[name];

        return (
          <SemanticPasswordInput
            id={id}
            name={field.name}
            value={value}
            placeholder={placeholder}
            onChange={handleChange}
            onBlur={handleBlur}
            disabled={disabled}
            error={!!error}
          />
        );
      }}
    />
  );
}

PasswordInput.defaultProps = {
  id: null,
  placeholder: null,
  disabled: false,
};
