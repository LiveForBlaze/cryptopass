// @flow
import React from 'react';
import styled from 'styled-components';
import classNames from 'classnames';
import { translate } from 'react-i18next';
import { FastField } from 'formik';

const StyledFile = styled.div`
  position: relative;
  display: inline-block;
  width: 100%;
  height: 44px;
  margin-bottom: 0;
`;

const StyledFileLabel = styled.label`
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  z-index: 1;
  height: 44px;
  padding: 0 142px 0 14px;
  font-size: 14px;
  line-height: 42px;
  color: rgba(0, 0, 0, 0.87);
  background-color: #fff;
  border: 1px solid #dedede;
  border-radius: 4px;
  transition: color 0.1s ease, border-color 0.1s ease;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  &::after {
    position: absolute;
    top: 3px;
    right: 3px;
    bottom: 0;
    z-index: 3;
    display: block;
    height: 36px;
    padding: 0 14px;
    line-height: 34px;
    content: "Choose File";
    background-color: #2185D0;
    color: #fff;
    border-left: 1px solid #dedede;
    border-radius: 4px;
    width: 136px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    text-align: center;
  }

  &[data-content]::after {
    content: attr(data-content);
  }
`;

const StyledFileInput = styled.input`
  position: relative;
  z-index: 2;
  width: 100%;
  height: 44px;
  margin: 0;
  opacity: 0;

  &:disabled {
    opacity: 0 !important;
  }

  &:focus ~ ${StyledFileLabel} {
    border-color: rgba(34, 36, 38, 0.15);

    &::after {
      border-color: #2a87d0;
    }
  }

  &:disabled ~ ${StyledFileLabel} {
    opacity: .45;
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
  readOnly?: bool,
  onChange?: () => {
  },
};

export function InputFile({
  id,
  name,
  placeholder,
  disabled,
  readOnly,
  onChange,
  t,
}: Props): React.Node {
  this.handleChange = formik => (event) => {
    if (typeof onChange === 'function') {
      onChange(event);
    }
    formik.handleChange(event);
  };

  this.handleBlur = formik => () => {
    formik.setFieldTouched(name, true);
  };

  this.handleClick = (event) => {
    // eslint-disable-next-line no-param-reassign
    event.target.value = null;
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
        } = form;
        const value = values[name];
        const error = touched[name] && errors[name];
        const pholder = placeholder || t('fileInput.No file chosen');
        const buttonText = t('fileInput.Choose File') || 'Choose File';
        const filename = value && value.replace(/^.*[\\/]/, '');

        return (
          <StyledFile>
            <StyledFileInput
              type="file"
              id={id}
              name={field.name}
              onChange={this.handleChange(form)}
              onBlur={this.handleBlur(form)}
              onClick={this.handleClick}
              disabled={disabled}
              className={classNames({
                'is-error': error,
              })}
              readOnly={readOnly}
            />
            <StyledFileLabel
              htmlFor={id}
              data-content={buttonText}
            >
              {filename || pholder}
            </StyledFileLabel>
          </StyledFile>
        );
      }}
    />
  );
}

InputFile.defaultProps = {
  id: null,
  placeholder: null,
  disabled: false,
  readOnly: false,
  onChange: null,
};

export const InputFileTranslated = translate('common')(InputFile);
