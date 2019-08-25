// @flow
import React, { Component, Fragment } from 'react';
import styled from 'styled-components';
import { Grid, Button, Segment } from 'semantic-ui-react';
import { translate } from 'react-i18next';
import { Meteor } from 'meteor/meteor';
import { IdentityVerificationFormTranslated } from './IdentityVerificationForm';
import { AddressVerificationFormTranslated } from './AddressVerificationForm';
import { PhoneVerificationFormTranslated } from './PhoneVerificationForm';
import { StyledSegment } from './StyledFormComponents';
import '../../../../collections/validation.js';

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
  loading: bool,
  editable: bool,
  validationStatus: string,
  serverError: bool,
};

class CryptopassValidationFormInner extends Component<Props, State> {
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
    loading: true,
    editable: false,
    validationStatus: '',
    serverError: false,
  };

  static defaultProps = {
    userId: null,
  };

  componentDidMount() {
    const { data } = this.props;
    console.log(data);
    const USER_ID = data.id;
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
            const flag = res.data.infoJson['Evaluation Stack'][0].value[0].value;
            console.log('User: ', res);
            console.log('response :', flag);
            this.setState(prevState => ({
              ...prevState,
              validationStatus: flag,
            }));
          }
        );
      }
    });
    // eslint-disable-next-line react/no-did-mount-set-state
    this.setState({
      identity: data.identity,
      address: data.address,
      phone: data.phone,
      validationStatus: data.validationStatus,
      loading: false,
    });
    window.addEventListener('beforeunload', this.clearData);
  }

  componentWillUnmount() {
    window.removeEventListener('beforeunload', this.clearData);
  }

  clearData = () => {
    sessionStorage.clear();
  }

  handleApprove = () => {
    const { userId, data } = this.props;

    Validation.update({ _id: userId }, { $set: { validationStatus: 'approved' } });
    const USER_ID = data.id;
    Meteor.call('getDataHash', { USER_ID }, (er, re) => {
      if (er) {
        console.log(er);
      } else {
        Meteor.call(
          'invokeKycClient', {
            privateKey: '8a858d2549c5f032456ff4444f4e56800e8240806a37beaefc1974cdf1286bd6',
            contractId: '0xd5d7c7283b02187ba4c8065bb6854b21aa02615a',
            address: 'AQ9kpQe1j9yqjnRD1saWfRGnr5zRpscEUU',
          },
          [
            '0x6e8cd3239898142738039e79b31ae4c2ed74e45b',
            `0x${re}`,
            '2',
            '222222222',
          ],
          (err, res) => {
            console.log('User Id: ', re);
            console.log(res, err);
          }
        );
      }
    });
  };

  handleReject = () => {
    const { userId, data } = this.props;

    Validation.update({ _id: userId }, { $set: { validationStatus: 'rejected' } });
    const USER_ID = data.id;
    Meteor.call('getDataHash', { USER_ID }, (er, re) => {
      if (er) {
        console.log(er);
      } else {
        Meteor.call(
          'invokeKycClient', {
            privateKey: '8a858d2549c5f032456ff4444f4e56800e8240806a37beaefc1974cdf1286bd6',
            contractId: '0xd5d7c7283b02187ba4c8065bb6854b21aa02615a',
            address: 'AQ9kpQe1j9yqjnRD1saWfRGnr5zRpscEUU',
          },
          [
            '0x6e8cd3239898142738039e79b31ae4c2ed74e45b',
            `0x${re}`,
            '3',
            '222222222',
          ],
          (err, res) => {
            console.log('User Id: ', re);
            console.log(res, err);
          }
        );
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

    const validationForm = (
      <Fragment>
        <IdentityVerificationFormTranslated loading={loading} editable={editable} {...identity} userId={userId} />
        <AddressVerificationFormTranslated loading={loading} editable={editable} {...address} userId={userId} />
        <PhoneVerificationFormTranslated loading={loading} editable={editable} phone={phone} userId={userId} />
        {
          validationStatus === '1' &&
          <StyledSegment padded>
            <Grid>
              <Grid.Column width={8}>
                <Button negative fluid onClick={this.handleReject}>{t('validateForm.Reject')}</Button>
              </Grid.Column>
              <Grid.Column width={8}>
                <Button positive fluid onClick={this.handleApprove}>{t('validateForm.Approve')}</Button>
              </Grid.Column>
            </Grid>
          </StyledSegment>
        }
      </Fragment>
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
      case 'pending':
        render = validationForm;
        break;

      case 'approved':
        render = approvedMessage;
        break;

      case 'rejected':
        render = rejectedMessage;
        break;

      default:
        render = validationForm;
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

export const CryptopassValidationForm = translate('common')(CryptopassValidationFormInner);
