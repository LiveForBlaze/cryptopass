// @flow
import React from 'react';
import { translate } from 'react-i18next';
import { withRouter } from 'react-router';
import { Container, Grid } from 'semantic-ui-react';

import './UploadCryptopassInterface.css';

import { LoadCryptopassTranslated } from './Forms/LoadCryptopass';

export const UploadCryptopassInterface = () => (
  <div className="UserInterface" style={{ minHeight: '100%' }}>
    <div className="UserInterface">
      <Container>
        <Grid centered>
          <Grid.Column mobile={16} tablet={16} computer={10}>
            <LoadCryptopassTranslated />
          </Grid.Column>
        </Grid>
      </Container>
    </div>
  </div>
);

export const UploadCryptopassInterfaceTranslated = withRouter(translate('common')(UploadCryptopassInterface));
