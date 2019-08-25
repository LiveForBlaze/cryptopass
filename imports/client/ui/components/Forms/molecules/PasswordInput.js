// @flow
import React, { Component } from 'react';
import { Input, Icon } from 'semantic-ui-react';

/**
 * @pure: ?false
 * @hasTests: false
 */
type Props = {
  id?: string,
  name: string,
  placeholder?: string,
  disabled?: bool,
  className?: string,
  defaultValue?: string,
  error?: bool,
  onChange?: () => {
  },
  onBlur?: () => {
  },
};

type State = {
  type: string,
};

export class PasswordInput extends Component<Props, State> {
  static defaultProps = {
    id: null,
    placeholder: null,
    disabled: false,
    className: '',
    defaultValue: null,
    error: false,
    onChange: null,
    onBlur: null,
  };

  state = {
    type: 'password',
  };

  showHide = (e) => {
    const { type } = this.state;

    e.preventDefault();
    e.stopPropagation();

    this.setState({
      type: type === 'password' ? 'text' : 'password',
    });
  };

  render() {
    const {
      className,
      id,
      name,
      placeholder,
      disabled,
      defaultValue,
      error,
      onChange,
      onBlur,
    } = this.props;

    const { type } = this.state;

    return (
      <Input
        icon
        error={error}
      >
        <input
          id={id}
          name={name}
          placeholder={placeholder}
          disabled={disabled}
          className={className}
          defaultValue={defaultValue}
          onChange={onChange}
          onBlur={onBlur}
          type={type}
        />
        <Icon
          name={type === 'password' ? 'eye slash' : 'eye'}
          link
          onClick={this.showHide}
        />
      </Input>
    );
  }
}
