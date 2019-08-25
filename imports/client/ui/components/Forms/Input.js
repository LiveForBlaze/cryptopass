// @flow
import React from 'react';
import styled from 'styled-components';
import { Input as SemanticInput } from 'semantic-ui-react';
import { FastField } from 'formik';

const StyledInput = styled(SemanticInput)`
  &.ui.input > input {
    background-color: #fff;
    border-color: #dedede;
  }

  &.ui.input.error > input {
    background-color: #ffcfcf;
    border-color: #ff7373;
  }

  &.ui.input input[readonly],
  &.ui.input input[readonly]:hover,
  &.ui.input input[readonly]:focus {
    border-style: dashed;
    background-color: transparent;
  }
`;

/**
 * @pure: ?false
 * @hasTests: false
 */
type Props = {
  id?: string,
  name: string,
  type: string,
  placeholder?: string,
  disabled?: bool,
  readOnly?: bool,
  loading?: bool,
  onChange?: () => {
  },
};

export function Input({
  id,
  name,
  placeholder,
  disabled,
  readOnly,
  loading,
  type,
  onChange,
}: Props): React.Node {
  this.handleChange = formik => (event) => {
    formik.handleChange(event);
    if (typeof onChange === 'function') {
      onChange(event);
    }
  };

  return (
    <FastField
      name={name}
      // eslint-disable-next-line
      render={({ field, form }) => {
        const {
          touched,
          errors,
          values,
          handleBlur,
        } = form;
        const value = values[name];
        const error = touched[name] && errors[name];

        sessionStorage.setItem(name, value);

        if (!error) {
          sessionStorage.setItem(`${name}Valid`, '1');
        } else {
          sessionStorage.setItem(`${name}Valid`, '0');
        }

        return (
          <StyledInput
            name={field.name}
            id={id}
            type={type}
            value={value}
            placeholder={!readOnly && placeholder || null}
            onChange={!readOnly && this.handleChange(form) || null}
            onBlur={!readOnly && handleBlur || null}
            disabled={disabled}
            error={!readOnly && !!error || null}
            loading={loading}
            readOnly={readOnly}
          />
        );
      }}
    />
  );
}

Input.defaultProps = {
  id: null,
  placeholder: null,
  disabled: false,
  readOnly: false,
  loading: false,
  onChange: null,
};
