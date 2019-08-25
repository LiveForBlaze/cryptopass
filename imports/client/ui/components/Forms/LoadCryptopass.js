// @flow
import React, { Fragment, Component } from 'react';
import { Redirect } from 'react-router-dom';
import { Meteor } from 'meteor/meteor';
import { translate } from 'react-i18next';
import { Form, Grid, Header, Button } from 'semantic-ui-react';
import { devprint } from '../../../../api/helpers';
import { StyledLabel } from './Field';
import { StyledSegment } from './StyledFormComponents';
import { Input } from './molecules/Input';

/**
 * @pure: ?true
 * @hasTests: false
 */

export class LoadCryptopass extends Component {
  state = {
    pwd: '',
    file: null,
    success: false,
  };

  handleZipUpload = (e) => {
    e.preventDefault();
    const file = e.target.files[0];

    this.setState({ file });
  };

  inputChange = (e) => {
    this.setState({ pwd: e.target.value });
  };

  extractZip = () => {
    const { file, pwd: password } = this.state;
    const reader = new FileReader();
    reader.onload = (e) => {
      const zipData = new Uint8Array(e.target.result);

      Meteor.call('getDataHash', { data: zipData }, (error, zipHash) => {
        if (error) {
          devprint(`getDataHash zip failed: ${error}`);
        } else {
          this.setState({
            zipHash,
          });
        }
      });

      Meteor.call('extractZip', { data: zipData, password }, (extractError) => {
        if (extractError) {
          devprint(`extractZip failed: ${extractError}`);
        } else {
          this.setState({
            success: true,
          });
        }
      });
    };
    reader.readAsArrayBuffer(file);
  };

  render() {
    const { t } = this.props;
    const {
      pwd, file, success, zipHash,
    } = this.state;

    if (success && file) {
      const userId = file.name.split('.')[0];
      return (
        <Redirect to={{
          pathname: `/view/${userId}`,
          state: { zipHash },
        }}
        />
      );
    }

    return (
      <StyledSegment padded>
        <Form id="load-cryptopass">
          <Header as="h2">
            {t('modal.Upload your Cryptopass')}
          </Header>
          <Grid>
            <Grid.Column width={16}>
              <label htmlFor="selfie">
                <input
                  id="selfie"
                  type="file"
                  onChange={this.handleZipUpload}
                />
              </label>
            </Grid.Column>
            {
              file !== null &&
              <Fragment>
                <Grid.Column width={16}>
                  <div>&#10004; {`${file.name}`}</div>
                </Grid.Column>
                <Grid.Column width={16}>
                  <Form.Field>
                    <StyledLabel htmlFor="password">
                      {t('modal.Specify password for your Cryptopass')}
                    </StyledLabel>
                    <Input
                      id="password"
                      type="password"
                      placeholder={t('modal.Password')}
                      value={pwd}
                      onChange={this.inputChange}
                    />
                  </Form.Field>
                </Grid.Column>
                <Grid.Row centered>
                  <Grid.Column mobile={16} tablet={8} computer={8}>
                    <Button fluid color="green" onClick={this.extractZip}>{t('modal.Extract data from Cryptopass')}</Button>
                  </Grid.Column>
                </Grid.Row>
              </Fragment>
            }
          </Grid>
        </Form>
      </StyledSegment>
    );
  }
}

export const LoadCryptopassTranslated = translate('common')(LoadCryptopass);
