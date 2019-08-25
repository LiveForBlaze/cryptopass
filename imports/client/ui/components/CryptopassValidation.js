// @flow
import React from 'react';
import { Redirect } from 'react-router-dom';
import { Container, Grid } from 'semantic-ui-react';
import { withRouter } from 'react-router';
import { LoginTranslated } from './Login';
import { devprint } from '../../../api/helpers';
import { CryptopassValidationForm } from './Forms/CryptopassValidationForm';
import '../../../collections/validation.js';
import './UserInterface.css';

class CryptopassValidationInner extends React.Component {
  state = {
    resp: {
      id: '',
    },
    ready: false,
  }

  componentDidMount() {
    Meteor.subscribe('validation');
    const userId = this.props.match.params;
    Meteor.call('readBlockchain', { userId }, (error, resp) => {
      if (error) {
        devprint(`getData error: ${error}`);
      }
      devprint(`checkFiles response: ${resp}`);
      this.setState({
        resp,
        ready: true,
      });
      console.log(resp);
    });
  }
  render() {
    const { user, match } = this.props;
    const { ready, resp } = this.state;
    const { userId } = match.params;
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
                  { ready && <CryptopassValidationForm userId={userId} data={resp} id={resp.id} />}
                </Grid.Column>
              </Grid>
            </Container>
          </div>
        </div>
      );
    }

    return (
      <Redirect to={{
      pathname: '/cryptopass-list',
    }}
      />
    );
  }
}

export const CryptopassValidation = withRouter(CryptopassValidationInner);
