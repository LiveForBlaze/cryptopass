// @flow
import React, { Component } from 'react';
import styled from 'styled-components';
import shortid from 'shortid';

const StyledWrapper = styled.span`
  position: relative;
  display: inline-block;
  vertical-align: top;
  width: 100%;
  overflow: hidden;
`;

const StyledLabel = styled.label`
  position: absolute;
  bottom: 0;
  left: 0;
  display: inline-block;
  width: 100%;
  height: calc(100% - 2.54rem);
  text-align: left;
  pointer-events: none;
  color: rgba(191, 191, 191, .87);
  font-size: 1rem;
  line-height: 1.21428571rem;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  -webkit-touch-callout: none;
  user-select: none;

  &::before,
  &::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border-bottom: 1px solid rgba(34, 36, 38, .15);
  }

  &::after {
    margin-top: 0;
    border-bottom: 2px solid #2185d0;
    transform: translate3d(-100%, 0, 0);
    transition: all .3s;
  }
`;

const StyledLabelContent = styled.span`
  position: absolute;
  transition: all .3s;
  display: block;
  top: 0;
  width: 100%;
`;

const StyledInput = styled.input`
  position: relative;
  display: grey;
  float: right;
  margin-top: 0;
  padding: 2.57rem 0 .67857143rem;
  width: 100%;
  border: 0;
  border-radius: 0;
  background: transparent;
  font-size: 1rem;
  line-height: 1.21428571rem;
  -webkit-appearance: none;

  &:focus,
  &.is-filled {
    outline: none;
  }

  &:focus + ${StyledLabel},
  &.is-filled + ${StyledLabel} {
    height: calc(100% - 2.35rem);
  }

  &:focus + ${StyledLabel}::after,
  &.is-filled + ${StyledLabel}::after {
    transform: translate3d(0, 0, 0);
  }

  &:focus + ${StyledLabel} ${StyledLabelContent},
  &.is-filled + ${StyledLabel} ${StyledLabelContent} {
    color: #2185d0;
    font-size: .9285rem;
    line-height: 1.35714rem;
    transform: translate3d(0, -100%, 0);
  }
`;

/**
 * @pure: ?false
 * @hasTests: false
 */
type Props = {
  type?: string,
  label?: string,
  defaultValue?: string,
};

type State = {
  value: string,
};

export class FloatingLabelInput extends Component<Props, State> {
  static defaultProps = {
    type: 'text',
    label: '',
    defaultValue: '',
  };

  state = {
    value: this.props.defaultValue,
  };

  handleChange = (e) => {
    this.setState({
      value: e.target.value,
    });
  };

  render() {
    const { type, label } = this.props;
    const inputId = shortid.generate();
    const { value } = this.state;

    return (
      <span>
        <StyledWrapper>
          <StyledInput
            id={inputId}
            type={type}
            value={value}
            onChange={this.handleChange}
            className={`${value.length ? 'is-filled' : ''}`}
          />
          <StyledLabel htmlFor={inputId}>
            <StyledLabelContent>{label}</StyledLabelContent>
          </StyledLabel>
        </StyledWrapper>
      </span>
    );
  }
}
