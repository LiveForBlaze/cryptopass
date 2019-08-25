// @flow
import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import { translate } from 'react-i18next';
import { Container, Grid } from 'semantic-ui-react';
import { CryptopassListItem } from './CryptopassListItem';
import { devprint } from '../../../api/helpers';
import '../../../collections/validation.js';
import './UploadCryptopassInterface.css';

class CryptopassListUI extends Component {
  state = {
    pendingUsers: [],
    ready: false,
  };

  componentDidMount() {
    Meteor.call('getData', (error, pendingUsers) => {
      if (error) {
        devprint(`getData error: ${error}`);
      }
      devprint(`checkFiles response: ${pendingUsers}`);
      this.setState({
        pendingUsers,
        ready: true,
      });
    });
  }
  render() {
    const { ready, pendingUsers } = this.state;

    return (
      <div className="UserInterface" style={{ minHeight: '100%' }}>
        <div className="UserInterface">
          <Container>
            <Grid centered>
              {ready && <CryptopassListItem pendingUsers={pendingUsers} />}
            </Grid>
          </Container>
        </div>
      </div>
    );
  }
}

export const CryptopassList = translate('common')(CryptopassListUI);
