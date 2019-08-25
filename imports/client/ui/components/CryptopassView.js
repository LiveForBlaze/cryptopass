// @flow
import React from 'react';
import { Redirect } from 'react-router-dom';
import { Container, Grid } from 'semantic-ui-react';
import { withRouter } from 'react-router';
import { LoginTranslated } from './Login';

import './UserInterface.css';

import { CryptopassViewForm } from './Forms/CryptopassViewForm';

const CryptopassViewInner = ({ match, user }) => {
  if (user !== undefined && !user) {
    return (
      <div className="UserInterface" style={{ minHeight: '100%' }}>
        <div className="UserInterface">
          <Container fluid>
            <Grid centered>
              <Grid.Column mobile={16} tablet={8} computer={7}>
                <LoginTranslated />
              </Grid.Column>
            </Grid>
          </Container>
        </div>
      </div>
    );
  }

  if (match.params.userId !== undefined) {
    return (
      <div className="UserInterface" style={{ minHeight: '100%' }}>
        <div className="UserInterface">
          <Container fluid>
            <Grid centered>
              <Grid.Column mobile={16} tablet={16} computer={10}>
                <CryptopassViewForm userId={match.params.userId} />
              </Grid.Column>
            </Grid>
          </Container>
        </div>
      </div>
    );
  }

  return (
    <Redirect to={{
      pathname: '/upload',
    }}
    />
  );
};

export const CryptopassView = withRouter(CryptopassViewInner);
