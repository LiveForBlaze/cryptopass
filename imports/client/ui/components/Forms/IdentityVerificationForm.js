// @flow
import React, { Component, Fragment } from 'react';
import { Meteor } from 'meteor/meteor';
import { Form, Button, Loader, Grid, Popup, Message, Icon } from 'semantic-ui-react';
import classNames from 'classnames';
import { FormikConsumer } from 'formik';
import { translate } from 'react-i18next';
import { Field, StyledLabel } from './Field';
import { Image } from './Image';
import { Input } from './Input';
import { FormHOC } from './FormHOC';
import { StyledSegment, StyledHeader, StyledBlock, StyledDiv } from './StyledFormComponents';
import { IdentityForm as IdentityFormFormik } from './formik-ui/IdentityForm';
import { recognize } from '../../../helpers/ocr-module';
import { devprint } from '../../../../api/helpers';
import { saveImage, deleteImage, clearUserData, clearUserImagesFromCollection } from '../../../helpers/file-processing';

import { MAX_COUNT_PASS, MAX_COUNT_SELFIE } from '../../../constants.js';

class IdentityForm extends Component {
  state = {
    filePass: [],
    fileSelfie: [],
    recognizeRun: false,
    recognizeFinish: false,
    fileId: [0, 0, 0, 0, 0],
  };

  static defaultProps = {
    passportFile: 'http://via.placeholder.com/800x600',
    passportFile2: '',
    passportFile3: '',
    passportFile4: '',
    passportFile5: '',
    selfieFile: 'http://via.placeholder.com/800x600',
    editable: true,
    loading: false,
  };

  shouldComponentUpdate(nextProps, nextState) {
    const {
      userId,
      values,
      editable,
      loading,
      setValues,
      firstName,
      lastName,
      dateOfBirth,
      placeOfBirth,
      citizenship,
      passport,
      issuedBy,
      issueDate,
      expiryDate,
    } = nextProps;

    const {
      filePass,
      fileSelfie,
    } = nextState;

    if (!userId) {
      return false;
    }

    if (!editable && !loading && loading !== this.props.loading) {
      setValues({
        ...values,
        firstName,
        lastName,
        dateOfBirth,
        placeOfBirth,
        citizenship,
        passport,
        issuedBy,
        issueDate,
        expiryDate,
      });
    }

    if (!nextState.recognizeRun && nextState.recognizeRun !== this.state.recognizeRun) {
      setValues({
        ...values,
        firstName: nextState.firstName,
        lastName: nextState.lastName,
        dateOfBirth: nextState.dateOfBirth,
        // placeOfBirth: nextState.placeOfBirth,
        // citizenship: nextState.citizenship,
        passport: nextState.passport,
        issuedBy: nextState.issuedBy,
        issueDate: nextState.issueDate,
        expiryDate: nextState.expiryDate,
      });
    }

    if (parseInt(values.filePassResult, 10) !== filePass.length) {
      this.setState({
        ...nextState,
        filePass: filePass.slice(0, values.filePassResult),
      });
    }

    if (parseInt(values.fileSelfieResult, 10) !== fileSelfie.length) {
      this.setState({
        ...nextState,
        fileSelfie: fileSelfie.slice(0, values.fileSelfieResult),
      });
    }

    return true;
  }

  componentDidMount() {
    // Meteor.call('invokeGetClient', {
    //   privateKey: '4f7dde870dd1e60b89dc601ae2555f0256b1a59b2567b7e24699fefab4d37dae',
    //   contractId: '0xd5d7c7283b02187ba4c8065bb6854b21aa02615a',
    // },
    // ['0xC0D2F7517CFAD8E4050514A5E9714F0885C7910D563E1175C1A9BA0D0F7AFC11'],
    //   (err, res) => {
    //   console.log(res, err);
    // });
    Meteor.call(
      'invokeAddVerifier', {
        privateKey: '4f7dde870dd1e60b89dc601ae2555f0256b1a59b2567b7e24699fefab4d37dae',
        contractId: '0xd5d7c7283b02187ba4c8065bb6854b21aa02615a',
      },
      ['0xC0D2F7517CFAD8E4050514A5E9714F0885C7910D563E1175C1A9BA0D0F7AFC11'],
      (err, res) => {
        devprint(`${res} ${err}`);
      }
    );
    window.addEventListener('beforeunload', this.clearDataPrivate);
  }

  componentWillUnmount() {
    window.removeEventListener('beforeunload', this.clearDataPrivate);
  }

  clearDataPrivate = () => {
    clearUserData();
    clearUserImagesFromCollection();
  }

  handleFileUpload = (e) => {
    e.persist();

    const PASS_ID = 'pass';
    const SELFIE_ID = 'selfie';
    const { filePass, fileSelfie, fileId } = this.state;
    const { setValues, values } = this.props;
    const file = e.target.files[0];
    const ext = file.name.split('.').pop();
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    let text = '';

    for (let i = 0; i < 10; i += 1) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    file.uploadId = e.target.id;
    if (file.uploadId === PASS_ID && filePass.length < MAX_COUNT_PASS) {
      this.setState(prevState => ({
        filePass: [
          ...prevState.filePass,
          file,
        ],
      }));
      const newFile = new File([file], `${text}.${ext}`);
      newFile.uploadId = e.target.id;
      file.newName = newFile.name;
      const fileIndex = fileId.indexOf(0);
      const fileIdEditable = fileId.slice();
      fileIdEditable[fileIndex] = 1;
      this.setState({
        fileId: fileIdEditable,
      });
      saveImage(newFile, fileIndex);
      setValues({
        ...values,
        filePassResult: filePass.length + 1,
      });
    }

    if (file.uploadId === SELFIE_ID && fileSelfie.length < MAX_COUNT_SELFIE) {
      this.setState(prevState => ({
        fileSelfie: [
          ...prevState.fileSelfie,
          file,
        ],
      }));
      const newFile = new File([file], `${text}.${ext}`);
      newFile.uploadId = e.target.id;
      file.newName = newFile.name;
      saveImage(newFile, fileSelfie.length);
      setValues({
        ...values,
        fileSelfieResult: fileSelfie.length + 1,
      });
    }
  };

  handleFileDelete = file => (e) => {
    e.preventDefault();

    const PASS_ID = 'pass';
    const SELFIE_ID = 'selfie';
    const { filePass, fileSelfie, fileId } = this.state;
    const { setValues, values } = this.props;

    if (file.uploadId === PASS_ID && filePass.length > 0) {
      const index = filePass.indexOf(file);

      filePass.splice(index, 1);

      this.setState({
        filePass,
      });

      deleteImage(file, index);

      const fileIdEditable = fileId.slice();
      fileIdEditable[index] = 0;
      this.setState({
        fileId: fileIdEditable,
      });
      const lastFilePassName = (filePass.length !== 0) ? filePass[filePass.length - 1].name : '';

      setValues({
        ...values,
        filePass: lastFilePassName,
        filePassResult: filePass.length,
      });
    }

    if (file.uploadId === SELFIE_ID && fileSelfie.length > 0) {
      const index = fileSelfie.indexOf(file);

      fileSelfie.splice(index, 1);

      this.setState({
        fileSelfie,
      });

      deleteImage(file, index);

      const lastFileSelfieName = (fileSelfie.length !== 0) ? fileSelfie[fileSelfie.length - 1].name : '';

      setValues({
        ...values,
        fileSelfie: lastFileSelfieName,
        fileSelfieResult: fileSelfie.length,
      });
    }
  };

  processingOCR = () => {
    const { filePass } = this.state;
    this.setState({ recognizeRun: true });
    recognize(filePass)
      .then((response) => {
        devprint(`Recognize response: ${response}`);
        if (response[4]) {
          this.setState(prevState => ({
            ...prevState,
            ...response[4],
            recognizeRun: false,
            recognizeFinish: true,
          }));
        }
      });
  }

  photoUploadBlock = () => {
    const {
      t,
      editable,
      loading,
      touched,
      errors,
      passportFile,
      passportFile2,
      passportFile3,
      passportFile4,
      passportFile5,
      selfieFile,
    } = this.props;

    const {
      filePass,
      fileSelfie,
    } = this.state;

    const firstImageWidth = ((passportFile5) || (passportFile3 && !passportFile4) || (!passportFile2)) ? '16' : '8';

    return (
      <div>
        <StyledHeader
          as="h4"
          className={classNames({
            fade: !editable,
          })}
        >
          {
            editable
              ? t('identity.Please attach legal documents confirming your identity')
              : t('identity.Legal documents confirming your identity')
          }:
        </StyledHeader>
        {
          editable
            ? (
              <Grid>
                <StyledBlock>
                  <Grid.Column width={16}>
                    <StyledLabel>
                      <div><b>{t('identity.Photos required')}:</b></div>
                      {t('identity.Your passport / ID card')}
                    </StyledLabel>
                    <StyledDiv>
                      <img id="exampleInputEmail1" alt="" style={{ width: '100%' }} src="/id-reqs.png" />
                    </StyledDiv>
                    <StyledLabel>
                      {t('identity.If you dont have a passport / ID card – please upload a photo of another official document to verify your identity')}
                    </StyledLabel>
                  </Grid.Column>
                  <Grid.Column width={16}>
                    <StyledDiv>
                      {
                        touched.filePassResult && errors.filePassResult
                          ? (
                            <Message error visible>
                              {errors.filePassResult}
                            </Message>
                          )
                          : filePass.map(file => (
                            <div>
                              <span>&#10004; {`${file.name}`}</span>
                              <Icon link name="close" onClick={this.handleFileDelete(file)} />
                            </div>
                          ))
                      }
                    </StyledDiv>
                  </Grid.Column>
                  <Grid.Column width={16}>
                    {filePass.length >= 2 && t('lng') === '俄语'
                      ? (
                        <div>
                          {
                            this.state.recognizeRun
                              ? <Loader active size="medium" inline="centered">Processing Photos</Loader>
                              : <Button content="Send to OCR" onClick={this.processingOCR} />
                          }
                        </div>
                      ) : (
                        <div>
                          {
                            this.state.recognizeFinish
                              ? 'Файлы обработаны.'
                              : (
                                <Fragment>
                                  <Input
                                    type="hidden"
                                    name="filePassResult"
                                  />
                                  <Field
                                    file
                                    name="filePass"
                                    id="pass"
                                    onChange={this.handleFileUpload}
                                    disabled={filePass.length >= MAX_COUNT_PASS}
                                  />
                                </Fragment>
                              )
                          }
                        </div>
                      )
                    }
                  </Grid.Column>
                </StyledBlock>
                <StyledBlock>
                  <Grid.Column width={16}>
                    <StyledLabel>
                      <div>
                        <b>{t('identity.Photos required')}:</b>
                      </div>
                      {t('identity.Selfie with passport / ID card')}
                    </StyledLabel>
                    <StyledDiv>
                      <img alt="" style={{ width: '100%' }} src="/selfie-reqs.png" />
                    </StyledDiv>
                    <StyledLabel>
                      {t('identity.You should hold it by the edge and close to your face so that we can verify that this document really belongs to you Both your face and the picture on the document should be clearly visible and any text on the document must be readable and not be covered by your fingers')}
                    </StyledLabel>
                  </Grid.Column>
                  <Grid.Column width={16}>
                    <StyledDiv>
                      {
                        touched.fileSelfieResult && errors.fileSelfieResult
                          ? (
                            <Message error visible>
                              {errors.fileSelfieResult}
                            </Message>
                          )
                          : fileSelfie.map(file => (
                            <div>
                              <span>&#10004; {`${file.name}`}</span>
                              <Icon link name="close" onClick={this.handleFileDelete(file)} />
                            </div>
                          ))
                      }
                    </StyledDiv>
                  </Grid.Column>
                  <Grid.Column width={16}>
                    <Input
                      type="hidden"
                      name="fileSelfieResult"
                    />
                    <Field
                      file
                      id="selfie"
                      name="fileSelfie"
                      onChange={this.handleFileUpload}
                      disabled={fileSelfie.length >= MAX_COUNT_SELFIE}
                    />
                  </Grid.Column>
                  <Grid.Column width={16}>
                    <StyledDiv>
                      <StyledLabel>{t('identity.Requirements')}:</StyledLabel>
                      <ul className="list-group">
                        <li className="list-group-item">{t('address.photos.Photos must depict account owner')}</li>
                        <li className="list-group-item">
                          {t('address.photos.Resolution must be no less than 600x600 pixels')}
                        </li>
                        <li className="list-group-item">{t('address.photos.Photos must be crisp, not blurred')}</li>
                        <li className="list-group-item">{t('address.photos.File size must not exceed 2 mb')}</li>
                        <li className="list-group-item">{t('address.photos.Accepted formats are JPEG, JPG, PNG')}</li>
                      </ul>
                    </StyledDiv>
                  </Grid.Column>
                </StyledBlock>
              </Grid>
            )
            : (
              <Grid centered>
                {
                  passportFile && (
                    <Grid.Column mobile={16} tablet={firstImageWidth} computer={firstImageWidth}>
                      <Image
                        src={passportFile}
                        loading={loading}
                      />
                    </Grid.Column>
                  )
                }
                {
                  passportFile2 && (
                    <Grid.Column mobile={16} tablet={8} computer={8}>
                      <Image
                        src={passportFile2}
                        loading={loading}
                      />
                    </Grid.Column>
                  )
                }
                {
                  passportFile3 && (
                    <Grid.Column mobile={16} tablet={8} computer={8}>
                      <Image
                        src={passportFile3}
                        loading={loading}
                      />
                    </Grid.Column>
                  )
                }
                {
                  passportFile4 && (
                    <Grid.Column mobile={16} tablet={8} computer={8}>
                      <Image
                        src={passportFile4}
                        loading={loading}
                      />
                    </Grid.Column>
                  )
                }
                {
                  passportFile5 && (
                    <Grid.Column mobile={16} tablet={8} computer={8}>
                      <Image
                        src={passportFile5}
                        loading={loading}
                      />
                    </Grid.Column>
                  )
                }
                <Grid.Column mobile={16} tablet={16} computer={16}>
                  <StyledHeader
                    as="h4"
                    className={classNames({
                      fade: !editable,
                    })}
                  >
                    {t('identity.Selfie with passport / ID card')}:
                  </StyledHeader>
                </Grid.Column>
                {
                  selfieFile && (
                    <Grid.Column mobile={16} tablet={16} computer={16}>
                      <Image
                        src={selfieFile}
                        loading={loading}
                      />
                    </Grid.Column>
                  )
                }
              </Grid>
            )
        }
      </div>
    );
  };

  render() {
    const {
      handleSubmit,
      hide,
      t,
      editable,
      loading,
      registerFormik,
    } = this.props;

    return (
      !hide &&
      <FormikConsumer>
        {
          (formik) => {
            registerFormik(formik);
            return (
              <StyledSegment padded id="step1">
                <Form onSubmit={handleSubmit} autoComplete="off">
                  <StyledHeader
                    as="h2"
                    className={classNames({
                      fade: !editable,
                    })}
                  >
                    {
                      editable
                        ? t('identity.Step 1 of 4 verify your identity')
                        : t('identity.Verify your identity')
                    }
                  </StyledHeader>
                  {t('lng') === '俄语' && this.photoUploadBlock()}
                  <Grid>
                    <Grid.Column mobile={16} tablet={8} computer={8}>
                      <Field
                        label={t('identity.First Name')}
                        name="firstName"
                        placeholder={t('identity.First Name')}
                        editable={editable}
                        loading={loading}
                      />
                    </Grid.Column>
                    <Grid.Column mobile={16} tablet={8} computer={8}>
                      <Field
                        label={t('identity.Last Name')}
                        name="lastName"
                        placeholder={t('identity.Last Name')}
                        editable={editable}
                        loading={loading}
                      />
                    </Grid.Column>
                    <Grid.Column mobile={16} tablet={8} computer={8}>
                      <Field
                        datepicker
                        label={t('identity.Date of birth')}
                        name="dateOfBirth"
                        minDate="130"
                        maxDate="now"
                        placeholder={t('identity.DD MM YYYY')}
                        editable={editable}
                        loading={loading}
                      />
                    </Grid.Column>
                    <Grid.Column mobile={16} tablet={8} computer={8}>
                      <Field
                        label={t('identity.Place of birth')}
                        name="placeOfBirth"
                        placeholder={t('identity.Place of birth')}
                        editable={editable}
                        loading={loading}
                      />
                    </Grid.Column>
                    <Grid.Column mobile={16} tablet={8} computer={8}>
                      <Field
                        country
                        id="citizenshipDropdown"
                        label={t('identity.Citizenship')}
                        name="citizenship"
                        placeholder={t('identity.Citizenship')}
                        editable={editable}
                        loading={loading}
                      />
                    </Grid.Column>
                    <Grid.Column mobile={16} tablet={8} computer={8}>
                      <Field
                        label={t('identity.Passport / national ID number')}
                        name="passport"
                        placeholder={t('identity.Passport / national ID number')}
                        editable={editable}
                        loading={loading}
                      />
                    </Grid.Column>
                    <Grid.Column width={16}>
                      <Field
                        label={t('identity.Issued by')}
                        name="issuedBy"
                        placeholder={t('identity.Issued by')}
                        editable={editable}
                        loading={loading}
                      />
                    </Grid.Column>
                    <Grid.Column mobile={16} tablet={8} computer={8}>
                      <Field
                        datepicker
                        label={t('identity.Issue date')}
                        name="issueDate"
                        minDate="130"
                        maxDate="now"
                        placeholder={t('identity.DD MM YYYY')}
                        editable={editable}
                        loading={loading}
                      />
                    </Grid.Column>
                    <Grid.Column mobile={16} tablet={8} computer={8}>
                      {
                        editable
                          ? <Popup
                            trigger={
                              <div>
                                <Field
                                  datepicker
                                  label={t('identity.Expiry date')}
                                  name="expiryDate"
                                  minDate="now"
                                  maxDate="100"
                                  placeholder={t('identity.DD MM YYYY')}
                                  editable={editable}
                                  loading={loading}
                                />
                              </div>
                            }
                            content={t('identity.If your document has no expiry data, specify any date that is significantly later than the current date (for example, 50 years from now)')}
                          />
                          : <Field
                            datepicker
                            label={t('identity.Expiry date')}
                            name="expiryDate"
                            minDate="now"
                            maxDate="100"
                            placeholder={t('identity.DD MM YYYY')}
                            editable={editable}
                            loading={loading}
                          />
                      }
                    </Grid.Column>
                    <Grid.Column width={16}>
                      {t('lng') !== '俄语' && this.photoUploadBlock()}
                    </Grid.Column>
                    {
                      editable &&
                      <Grid.Row centered>
                        <Grid.Column mobile={16} tablet={8} computer={8}>
                          <Form.Button color="blue" type="submit" fluid>
                            {t('interface.Next')}
                          </Form.Button>
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

export const IdentityVerificationFormTranslated = translate('common')(FormHOC(IdentityFormFormik(IdentityForm)));
