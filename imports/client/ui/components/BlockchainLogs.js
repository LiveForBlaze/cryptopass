// @flow
import React from 'react';
import styled from 'styled-components';
import { Container } from 'semantic-ui-react';
import { translate } from 'react-i18next';
import { LogsTranslated } from './Forms/Logs';

const StyledContainer = styled(Container)`
  padding-left: 15px;
  padding-right: 15px;
`;

const BlockchainLogs = () => (
  <div>
    <StyledContainer fluid>
      <LogsTranslated />
    </StyledContainer>
  </div>
);

export const BlockchainLogsTranslated = translate('common')(BlockchainLogs);
