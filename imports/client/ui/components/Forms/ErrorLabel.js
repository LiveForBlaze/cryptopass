// @flow
import React from 'react';
import styled from 'styled-components';
import { Label } from 'semantic-ui-react';
import { translate } from 'react-i18next';

export const StyledLabel = styled(Label)`
  &.ui.red.label {
    background-color: #e45b5b;
    border-color: #e45b5b;
  }
`;

const ErrorLabel = ({ error }) => (
  <StyledLabel
    color="red"
    pointing
  >
    {error}
  </StyledLabel>
);

export const ErrorLabelTranslated = translate('common')(ErrorLabel);
