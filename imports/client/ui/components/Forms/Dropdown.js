// @flow
import React, { Component } from 'react';
import styled from 'styled-components';
import { translate } from 'react-i18next';
import { Dropdown as SemanticDropdown } from 'semantic-ui-react';
import { FastField } from 'formik';
import _ from 'lodash';

const StyledDropdown = styled(SemanticDropdown)`
  &.ui.selection.dropdown.error {
    background: #ffcfcf;
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
  options: Array,
  search?: () => {},
  placeholder?: string,
  disabled?: bool,
};

export class Dropdown extends Component<Props> {
  static defaultProps = {
    id: null,
    search: null,
    placeholder: null,
    disabled: false,
  }

  handleChange = formik => (e, { value }) => {
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
      options,
      search,
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
          const sortedOptions = options.sort((a, b) => a.text.localeCompare(b.text));

          sessionStorage.setItem(name, value);

          if (!error) {
            sessionStorage.setItem(`${name}Valid`, '1');
          } else {
            sessionStorage.setItem(`${name}Valid`, '0');
          }

          return (
            <StyledDropdown
              name={field.name}
              id={id}
              selection
              label="Request Type"
              options={sortedOptions}
              search={search}
              value={value}
              error={!!error}
              onChange={this.handleChange(form)}
              onBlur={this.handleBlur(form)}
              placeholder={placeholder}
              disabled={disabled}
            />
          );
        }}
      />
    );
  }
}

function CountriesDropdownHOC(WrappedComponent) {
  return class Container extends Component {
    caseSensitiveSearch = (options, query) => {
      const re = new RegExp(`^${_.escapeRegExp(query)}`, 'i');
      return options.filter(opt => re.test(opt.text));
    };

    render() {
      const props = {
        selection: true,
        label: 'Request Type',
        options: this.props.t('countries', { returnObjects: true }),
        search: this.caseSensitiveSearch,
      };

      return <WrappedComponent {...this.props} {...props} />;
    }
  };
}

export const CountriesDropdownTranslated = translate('common')(CountriesDropdownHOC(Dropdown));
