// @flow
import React, { Component } from 'react';
import classNames from 'classnames';
import { translate } from 'react-i18next';
import styled from 'styled-components';
import moment from 'moment';
import { FastField } from 'formik';
import ReactDatePicker from 'react-datepicker';
import 'moment/locale/ru';
import 'moment/locale/de';
import 'moment/locale/zh-cn';
import 'react-datepicker/dist/react-datepicker.css';

const StyledWrapper = styled.div`
  & .react-datepicker-wrapper,
  & .react-datepicker__input-container {
    width: 100%;
  }

  & .react-datepicker__input-container input {
    background-color: #fff;
    border-color: #dedede;
  }

  &.is-error .react-datepicker__input-container input {
    background-color: #ffcfcf;
    border-color: #ff7373;
  }
`;

/**
 * @pure: ?false
 * @hasTests: false
 */
type Props = {
  className?: string,
  name: string,
  dateFormat?: string,
  minDate?: string,
  maxDate?: string,
  placeholder?: string,
  disabled?: bool,
  locale?: string,
};

export class DatePicker extends Component<Props> {
  static defaultProps = {
    className: null,
    dateFormat: 'DD.MM.YYYY',
    maxDate: null,
    minDate: null,
    placeholder: null,
    disabled: false,
    locale: 'en',
  };

  handleChangeRaw = formik => (event) => {
    const { name, value } = event.target;
    const { dateFormat } = this.props;

    const momentDate = moment(value, dateFormat, true);
    const updatedValue = momentDate.isValid() ? momentDate.format('DD.MM.YYYY') : '-1';

    formik.setFieldValue(name, updatedValue);
    formik.setFieldTouched(name, true);
  };

  handleChange = formik => (momentDate) => {
    const { name } = this.props;
    const value = momentDate ? momentDate.format('DD.MM.YYYY') : '';

    formik.setFieldValue(name, value);
    formik.setFieldTouched(name, true);
  };

  render() {
    const {
      name,
      dateFormat,
      maxDate,
      minDate,
      placeholder,
      disabled,
      className,
      locale,
      i18n,
      ...rest
    } = this.props;

    return (
      <FastField
        name={name}
        // eslint-disable-next-line
        render={({ field, form }) => {
          const { touched, errors, values } = form;
          const value = values[name];
          const momentDate = moment(value, dateFormat);
          const error = touched[name] && errors[name];
          const max = maxDate === 'now' ? moment() : moment().add(maxDate, 'years');
          const min = minDate === 'now' ? moment() : moment().subtract(minDate, 'years');

          sessionStorage.setItem(name, value);

          if (!error) {
            sessionStorage.setItem(`${name}Valid`, '1');
          } else {
            sessionStorage.setItem(`${name}Valid`, '0');
          }

          return (
            <StyledWrapper
              className={classNames(className, {
                'is-error': !!error,
              })}
            >
              <ReactDatePicker
                name={field.name}
                selected={momentDate.isValid() ? momentDate : null}
                minDate={min}
                maxDate={max}
                placeholderText={placeholder}
                dateFormat={dateFormat}
                disabledKeyboardNavigation
                onChangeRaw={this.handleChangeRaw(form)}
                onChange={this.handleChange(form)}
                disabled={disabled}
                showMonthDropdown
                showYearDropdown
                locale={i18n.language}
                scrollableYearDropdown
                yearDropdownItemNumber={130}
                {...rest}
              />
            </StyledWrapper>
          );
        }}
      />
    );
  }
}

export const DatePickerTranslated = translate('common')(DatePicker);
