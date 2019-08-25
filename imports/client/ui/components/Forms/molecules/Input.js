// @flow
import React, { Fragment } from 'react';
import { Form } from 'semantic-ui-react';
import InputMask from 'react-input-mask';
import styled from 'styled-components';
import { PasswordInput } from './PasswordInput';

type propTypes = {
  mask?: string,
  className: string,
  defaultValue?: string,
  label: string,
  name: string,
  onChange: () => {},
  placeholder?: string,
  type: string,
};

const StyledInput = styled.div`
  flex: 8;
`;


/**
 * @pure: ?true
 * @hasTests: false
 */
export function Input({
  type,
  className,
  mask,
  label,
  placeholder,
  name,
  defaultValue,
  onChange,
}: propTypes): React.Node {
  let render;

  if (mask) {
    render = (
      <Fragment>
        <label>{label}</label>
        <InputMask
          className={className}
          mask={mask}
          placeholder={placeholder}
          value={defaultValue}
          name={name}
          onChange={onChange}
        />
      </Fragment>
    );
  } else if (type === 'password') {
    render = (
      <Fragment>
        <label>{label}</label>
        <PasswordInput
          className={className}
          placeholder={placeholder}
          defaultValue={defaultValue}
          name={name}
          onChange={onChange}
        />
      </Fragment>
    );
  } else {
    render = (
      <Form.Input
        type={type || 'text'}
        label={label}
        placeholder={placeholder || label}
        className={className}
        value={defaultValue}
        name={name}
        onChange={onChange}
      />
    );
  }

  return (
    <StyledInput>
      <Form.Field>
        {render}
      </Form.Field>
    </StyledInput>
  );
}

Input.defaultProps = {
  mask: '',
  placeholder: '',
  defaultValue: '',
};
