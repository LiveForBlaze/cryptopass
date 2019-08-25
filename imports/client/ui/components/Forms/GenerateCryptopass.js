// @flow
import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import { translate } from 'react-i18next';
import { FormikConsumer } from 'formik';
import { Form, Button, Header, Loader, Grid, Message } from 'semantic-ui-react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { devprint } from '../../../../api/helpers';
import { clearUserImagesFromCollection, clearUserData } from '../../../helpers/file-processing';
import sessionHelper from '../../../helpers/session-storage';
import formHelper from '../../../helpers/form-is-valid';
import { USER_ID } from '../../../constants';
import { GenerateCryptopassForm as GenerateCryptopassFormFormik } from './formik-ui/GenerateCryptopassForm';
import { FormHOC } from './FormHOC';
import { Field } from './Field';
import { StyledSegment } from './StyledFormComponents';

const fileDownload = require('js-file-download/file-download');

/**
 * @pure: ?true
 * @hasTests: false
 */

export class GenerateCryptopass extends Component {
  state = {
    zip: '',
    isDownloading: false,
  };

  downloadJson = () => {
    const key = this.props.values.pwd;
    const userDoc = {
      identity: {
        firstName: sessionHelper('firstName'),
        lastName: sessionHelper('lastName'),
        dateOfBirth: sessionHelper('dateOfBirth'),
        placeOfBirth: sessionHelper('placeOfBirth'),
        citizenship: sessionHelper('citizenship'),
        passport: sessionHelper('passport'),
        issuedBy: sessionHelper('issuedBy'),
        issueDate: sessionHelper('issueDate'),
        expiryDate: sessionHelper('expiryDate'),
      },
      address: {
        country: sessionHelper('country'),
        city: sessionHelper('city'),
        address: sessionHelper('address'),
      },
      phone: sessionHelper('phone'),
    };
    this.setState({ isDownloading: true });
    Meteor.call('createZipfile', { userId: USER_ID, password: key, userDoc }, (error, response) => {
      if (error) {
        devprint(`createZipfile failed: ${error}`);
      } else if (!response) {
        devprint(`invalid response: ${typeof response}`);
      } else {
        this.setState({
          zip: response,
        }, this.downloadZip);
      }
      Meteor.call('getDataHash', { USER_ID }, (errr, resp) => {
        if (errr) {
          console.log(errr);
        } else {
          Meteor.call('invokeCreatePass', {
            privateKey: '4f7dde870dd1e60b89dc601ae2555f0256b1a59b2567b7e24699fefab4d37dae',
            contractId: '0xd5d7c7283b02187ba4c8065bb6854b21aa02615a',
          }, [
            resp,
            '0xD2D45AB1D45B2C201074A19849FEC6304A4AC4478C8D62F98B3016BA897F46D4',
          ], (res, err) => {
            console.log(res, err);
          });
        }
      });
    });
  };

  downloadZip = () => {
    const { user } = this.props;
    const { zip } = this.state;
    Meteor.call('downloadZip', { path: zip.filePath }, (error, response) => {
      if (error) {
        devprint(`downloadZip failed: ${error}`);
      } else if (!response) {
        devprint(`invalid response: ${typeof response}`);
      } else {
        fileDownload(response, `${user}.cryptopass`);
      }
      this.clearData();
      this.setState({ isDownloading: false });
    });
  };

  clearData = () => {
    const { handleResetForms } = this.props;
    sessionStorage.clear();
    clearUserData();
    clearUserImagesFromCollection();
    handleResetForms();
  }

  generateHandle = () => {
    const {
      setErrors,
      isValid,
      errors,
      t,
    } = this.props;

    const checkErrors = formHelper('firstNameValid') && formHelper('lastNameValid') && formHelper('dateOfBirthValid') &&
      formHelper('placeOfBirthValid') && formHelper('citizenshipValid') && formHelper('passportValid') &&
      formHelper('issuedByValid') && formHelper('issueDateValid') && formHelper('expiryDateValid') &&
      formHelper('countryValid') && formHelper('cityValid') && formHelper('addressValid') && formHelper('phoneValid') &&
      formHelper('filePassResult') && formHelper('fileSelfieResult') && formHelper('fileAddrResult');

    if (checkErrors && isValid) {
      this.downloadJson();
      this.notify();
    } else {
      setErrors({
        ...errors,
        invalidForm: t('validations.Form is not valid'),
      });
    }
  };

  notify = () => toast(this.props.t('notify.Within a few seconds, your Cryptopass archive will be downloaded'), {
    position: toast.POSITION.TOP_RIGHT,
    autoClose: false,
  });

  render() {
    const {
      isValid,
      errors,
      hide,
      t,
      registerFormik,
    } = this.props;

    const {
      isDownloading,
    } = this.state;

    return (
      !hide &&
      <FormikConsumer>
        {
          (formik) => {
            registerFormik(formik);
            return (
              <StyledSegment padded id="step4">
                <Form autoComplete="off">
                  <Header as="h2">{t('modal.Step 4 of 4 Generate your Cryptopass')}</Header>
                  <Grid>
                    <Grid.Column width={16}>
                      {t('modal.Specify password for your Cryptopass')}
                    </Grid.Column>
                    <Grid.Column width={16}>
                      <Field
                        password
                        label={t('modal.Password')}
                        name="pwd"
                        placeholder={t('modal.Password')}
                      />
                    </Grid.Column>
                    <Grid.Row centered>
                      <Grid.Column mobile={16} tablet={8} computer={8}>
                        <Button color="green" fluid disabled={!isValid || isDownloading} onClick={this.generateHandle}>
                          {
                            isDownloading
                              ? <Loader active size="mini" inline="centered" />
                              : t('modal.Generate your Cryptopass')
                          }
                        </Button>
                      </Grid.Column>
                    </Grid.Row>
                    {
                      errors && errors.invalidForm &&
                      <Grid.Row centered>
                        <Grid.Column width={16}>
                          <Message
                            error
                            visible
                            content={errors.invalidForm}
                          />
                        </Grid.Column>
                      </Grid.Row>
                    }
                  </Grid>
                </Form>
              </StyledSegment>
            );
          }
        }
      </FormikConsumer>
    );
  }
}

export const GenerateCryptopassTranslated = translate('common')(FormHOC(GenerateCryptopassFormFormik(GenerateCryptopass)));
