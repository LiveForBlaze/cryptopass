// @flow
import React, { Component, Fragment } from 'react';
import styled from 'styled-components';
import { Grid, Button, Segment } from 'semantic-ui-react';
import { translate } from 'react-i18next';
import _ from 'lodash';
import { Meteor } from 'meteor/meteor';
import { withRouter } from 'react-router';
import { devprint } from '../../../../api/helpers';
import { clearExtractedData, getUserImageURI } from '../../../helpers/file-processing';
import { IdentityVerificationFormTranslated } from './IdentityVerificationForm';
import { AddressVerificationFormTranslated } from './AddressVerificationForm';
import { PhoneVerificationFormTranslated } from './PhoneVerificationForm';
import { getFullCountryName } from './molecules/country-list';
import { StyledSegment } from './StyledFormComponents';

const StyledMessage = styled(Segment)`
  &.ui.segment {
    width: 100%;
  }
`;

/**
 * @pure: ?false
 * @hasTests: false
 */
type Props = {
  userId?: string,
  location?: Object,
};

type State = {
  identity?: {
    firstName: string,
    lastName: string,
    dateOfBirth: string,
    placeOfBirth: string,
    citizenship: string,
    passport: string,
    issuedBy: string,
    issueDate: string,
    expiryDate: string,
    passportFile: string,
    passportFile2: string,
    passportFile3: string,
    passportFile4: string,
    passportFile5: string,
    selfieFile: string,
  },
  address?: {
    country: string,
    city: string,
    address: string,
    addressFile: string,
    addressFile2: string,
  },
  phone: string,
  zipHash: string,
  dataHash: string,
  loading: bool,
  editable: bool,
  validationStatus: string,
  serverError: bool,
};

class CryptopassViewFormInner extends Component<Props, State> {
  state = {
    identity: {
      firstName: '',
      lastName: '',
      dateOfBirth: '',
      placeOfBirth: '',
      citizenship: '',
      passport: '',
      issuedBy: '',
      issueDate: '',
      expiryDate: '',
      passportFile: '',
      passportFile2: '',
      passportFile3: '',
      passportFile4: '',
      passportFile5: '',
      selfieFile: '',
    },
    address: {
      country: '',
      city: '',
      address: '',
      addressFile: '',
      addressFile2: '',
    },
    phone: '',
    dataHash: '',
    loading: true,
    editable: false,
    validationStatus: '',
    serverError: false,
  };

  static defaultProps = {
    userId: null,
    location: null,
  };

  componentDidMount() {
    const { userId } = this.props;
    const USER_ID = userId;
    Meteor.call('getDataHash', { USER_ID }, (er, re) => {
      if (er) {
        console.log(er);
      } else {
        Meteor.call(
          'invokeGetClient', {
            privateKey: '48a858d2549c5f032456ff4444f4e56800e8240806a37beaefc1974cdf1286bd6',
            contractId: '0xd5d7c7283b02187ba4c8065bb6854b21aa02615a',
            address: 'Acdy3RGNkRssAx7EXwWemkjjsAZJhC2sb6',
          },
          [
            `0x${re}`,
          ],
          (err, res) => {
            //const flag = res.data.infoJson['Evaluation Stack'][0].value[0].value;
            const flag = 0;
            console.log('User: ', res);
            console.log('response :', flag);
            console.log('error :', err);
            this.setState(prevState => ({
              ...prevState,
              validationStatus: flag,
            }));
          }
        );
      }
    });

    Meteor.call('readJSON', { userId }, (error, response) => {
      if (error) {
        devprint(`readJSON failed: ${error}`);
      } else if (!response) {
        devprint(`invalid response: ${typeof response}`);
      } else {
        const jsonData = JSON.stringify(response);

        Meteor.call('getDataHash', { data: jsonData }, (hashError, dataHash) => {
          if (hashError) {
            devprint(`getDataHash data.json failed: ${hashError}`);
          } else {
            this.setState(prevState => ({
              ...prevState,
              dataHash,
            }));
          }
        });

        const citizenship = getFullCountryName(response.identity.citizenship);
        const country = getFullCountryName(response.address.country);

        const identityImageTypeField = {
          pass: 'passportFile',
          pass2: 'passportFile2',
          pass3: 'passportFile3',
          pass4: 'passportFile4',
          pass5: 'passportFile5',
          selfie: 'selfieFile',
        };

        const addressImageTypeField = {
          adr: 'addressFile',
          adr2: 'addressFile2',
        };

        devprint(`response: ${response}`);
        this.setState(prevState => ({
          ...prevState,
          identity: {
            ...response.identity,
            citizenship,
          },
          address: {
            ...response.address,
            country,
          },
          phone: response.phone,
          loading: false,
        }));

        _.forEach(identityImageTypeField, (field, type) => {
          getUserImageURI({ userId, type }, (imageURI) => {
            this.setState(prevState => ({
              ...prevState,
              identity: {
                ...prevState.identity,
                [field]: imageURI,
              },
            }));
          });
        });

        _.forEach(addressImageTypeField, (field, type) => {
          getUserImageURI({ userId, type }, (imageURI) => {
            this.setState(prevState => ({
              ...prevState,
              address: {
                ...prevState.address,
                [field]: imageURI,
              },
            }));
          });
        });
      }
    });
    window.addEventListener('beforeunload', this.clearData);
  }

  componentWillUnmount() {
    window.removeEventListener('beforeunload', this.clearData);
  }

  clearData = () => {
    const { userId } = this.props;
    sessionStorage.clear();
    clearExtractedData(userId);
  }

  handleSend = () => {
    const { userId, location } = this.props;
    const {
      identity, address, phone, dataHash,
    } = this.state;
    Meteor.call('sendData', {
      userId,
      identity,
      address,
      phone,
      dataHash,
      zipHash: location.state.zipHash,
    });
    Meteor.call('updateUserData', {
      userId,
      identity,
      address,
      phone,
      dataHash,
      zipHash: location.state.zipHash,
      validationStatus: 'pending',
    }, (err) => {
      if (err) {
        this.setState({ serverError: true });
      } else {
        this.setState({ validationStatus: 'pending' });
        const USER_ID = userId;
        Meteor.call('getDataHash', { USER_ID }, (er, re) => {
          if (er) {
            console.log(er);
          } else {
            console.log(re);
            Meteor.call(
              'invokeKycClient', {
                privateKey: '8a858d2549c5f032456ff4444f4e56800e8240806a37beaefc1974cdf1286bd6',
                contractId: '0xd5d7c7283b02187ba4c8065bb6854b21aa02615a',
                address: 'AQ9kpQe1j9yqjnRD1saWfRGnr5zRpscEUU',
              },
              [
                '0x6e8cd3239898142738039e79b31ae4c2ed74e45b',
                `0x${re}`,
                '1',
                `0x${location.state.zipHash}`,
              ],
              (err, res) => {
                console.log('>>res: ', res);
                console.log('>>err: ', err);
              }
            );
            console.log('OK');
          }
        });
      }
    });
  };

  render() {
    const {
      identity,
      address,
      phone,
      loading,
      editable,
      validationStatus,
      serverError,
    } = this.state;

    const {
      userId,
      t,
    } = this.props;

    const viewForm = (
      <Fragment>
        <IdentityVerificationFormTranslated loading={loading} editable={editable} {...identity} userId={userId} />
        <AddressVerificationFormTranslated loading={loading} editable={editable} {...address} userId={userId} />
        <PhoneVerificationFormTranslated loading={loading} editable={editable} phone={phone} userId={userId} />
        {
          // validationStatus !== 'pending' &&
          // location && location.state && !!location.state.zipHash &&
          <StyledSegment padded>
            <Grid centered>
              <Grid.Column mobile={16} tablet={8} computer={8}>
                <Button positive fluid onClick={this.handleSend} disabled={loading}>{t('viewForm.Send for KYC')}</Button>
              </Grid.Column>
            </Grid>
          </StyledSegment>
        }
      </Fragment>
    );

    const pendingMessage = (
      <StyledMessage inverted padded="very" size="massive" color="orange" textAlign="center">
        {t('validateForm.Pending')}
      </StyledMessage>
    );

    const approvedMessage = (
      <StyledMessage inverted padded="very" size="massive" color="green" textAlign="center">
        {t('validateForm.Approved')}
      </StyledMessage>
    );

    const rejectedMessage = (
      <StyledMessage inverted padded="very" size="massive" color="red" textAlign="center">
        {t('validateForm.Rejected')}
      </StyledMessage>
    );

    const errorServerMessage = (<StyledMessage inverted padded size="massive" color="red" textAlign="center">{t('validateForm.Server Error')}</StyledMessage>);

    let render;

    switch (validationStatus) {
      case '1':
        render = [
          pendingMessage,
          viewForm,
        ];
        break;

      case '2':
        render = [
          approvedMessage,
          viewForm,
        ];
        break;

      case '3':
        render = [
          rejectedMessage,
          viewForm,
        ];
        break;

      default:
        render = [
          viewForm,
        ];
    }

    return (
      <div className="UserInterface" style={{ minHeight: '100%' }}>
        <div className="UserInterface">
          {render}
          {
            serverError &&
            errorServerMessage
          }
        </div>
      </div>
    );
  }
}

export const CryptopassViewForm = withRouter(translate('common')(CryptopassViewFormInner));
