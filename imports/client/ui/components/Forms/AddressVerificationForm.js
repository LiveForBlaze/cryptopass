// @flow
import React, { Component } from 'react';
import classNames from 'classnames';
import { FormikConsumer } from 'formik';
import { Form, Grid, Message, Icon } from 'semantic-ui-react';
import { translate } from 'react-i18next';
import { FormHOC } from './FormHOC';
import { saveImage, deleteImage } from '../../../helpers/file-processing';
import { Field, StyledLabel } from './Field';
import { Input } from './Input';
import { Image } from './Image';
import { StyledSegment, StyledHeader, StyledBlock, StyledDiv } from './StyledFormComponents';
import { AddressForm as AddressFormFormik } from './formik-ui/AddressForm';

import { MAX_COUNT_ADDR } from '../../../constants.js';

class AddressForm extends Component {
  state = {
    fileAddr: [],
    fileId: [0, 0, 0, 0, 0],
  };

  static defaultProps = {
    addressFile: 'http://via.placeholder.com/800x600',
    addressFile2: '',
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
      city,
      country,
      address,
    } = nextProps;

    const {
      fileAddr,
    } = nextState;

    if (!userId) {
      return false;
    }

    if (!editable && !loading && loading !== this.props.loading) {
      setValues({
        ...values,
        city,
        country,
        address,
      });
    }

    if (parseInt(values.fileAddrResult, 10) !== fileAddr.length) {
      this.setState({
        ...nextState,
        fileAddr: fileAddr.slice(0, values.fileAddrResult),
      });
    }

    return true;
  }

  handleFileUpload = (e) => {
    e.persist();

    const ADDR_ID = 'adr';
    const { setValues, values } = this.props;
    const { fileAddr, fileId } = this.state;
    const file = e.target.files[0];
    const ext = file.name.split('.').pop();
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    let text = '';
    for (let i = 0; i < 5; i += 1) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    file.uploadId = e.target.id;

    if (file.uploadId === ADDR_ID && fileAddr.length < MAX_COUNT_ADDR) {
      this.setState(prevState => ({
        fileAddr: [
          ...prevState.fileAddr,
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
        fileAddrResult: fileAddr.length + 1,
      });
    }
  };

  handleFileDelete = file => (e) => {
    e.preventDefault();

    const ADDR_ID = 'adr';
    const { fileAddr, fileId } = this.state;
    const { setValues, values } = this.props;

    if (file.uploadId === ADDR_ID && fileAddr.length > 0) {
      const index = fileAddr.indexOf(file);

      fileAddr.splice(index, 1);

      this.setState({
        fileAddr,
      });

      deleteImage(file, index);

      const fileIdEditable = fileId.slice();
      fileIdEditable[index] = 0;
      this.setState({
        fileId: fileIdEditable,
      });
      const lastFileAddrName = (fileAddr.length !== 0) ? fileAddr[fileAddr.length - 1].name : '';

      setValues({
        ...values,
        fileAddr: lastFileAddrName,
        fileAddrResult: fileAddr.length,
      });
    }
  };

  render() {
    const {
      handleSubmit,
      hide,
      t,
      editable,
      loading,
      touched,
      errors,
      registerFormik,
      addressFile,
      addressFile2,
    } = this.props;
    const { fileAddr } = this.state;
    const firstImageWidth = addressFile2 ? '8' : '16';
    return (
      !hide &&
      <FormikConsumer>
        {
          (formik) => {
            registerFormik(formik);
            return (
              <StyledSegment padded id="step2">
                <Form onSubmit={handleSubmit} autoComplete="off">
                  <StyledHeader
                    as="h2"
                    className={classNames({
                      fade: !editable,
                    })}
                  >
                    {
                      editable
                        ? t('address.Step 2 of 4 verify your address')
                        : t('address.Verify your address')
                    }
                  </StyledHeader>
                  <Grid>
                    <Grid.Column mobile={16} tablet={8} computer={8}>
                      <Field
                        country
                        id="countryDropdown"
                        label={t('address.Country')}
                        name="country"
                        placeholder={t('address.Country')}
                        editable={editable}
                        loading={loading}
                      />
                    </Grid.Column>
                    <Grid.Column mobile={16} tablet={8} computer={8}>
                      <Field
                        label={t('address.City')}
                        name="city"
                        placeholder={t('address.City')}
                        editable={editable}
                        loading={loading}
                      />
                    </Grid.Column>
                    <Grid.Column width={16}>
                      <Field
                        label={t('address.Address')}
                        name="address"
                        placeholder={t('address.Address')}
                        editable={editable}
                        loading={loading}
                      />
                    </Grid.Column>
                    <Grid.Column width={16}>
                      <StyledHeader
                        as="h4"
                        className={classNames({
                          fade: !editable,
                        })}
                      >
                        {
                          editable
                            ? t('address.Please attach legal documents confirming your address')
                            : t('address.Legal documents confirming your address')
                        }
                      </StyledHeader>
                      {
                        editable
                          ? (
                            <Grid>
                              <StyledBlock>
                                <Grid.Column width={16}>
                                  <StyledLabel><b>{t('address.Required photos')}</b></StyledLabel>
                                  <ol>
                                    <li>{t('address.Passport page / ID card side showing address of registration')}</li>
                                    <li>
                                      {t('address.Additional document from the list as address confirmation')}
                                      <ul className="list-group">
                                        <li className="list-group-item">{t('address.utility bills (gas, water, phone, etc)')}</li>
                                        <li className="list-group-item">{t('address.official bank statements')}</li>
                                        <li className="list-group-item">{t('address.tax authority letters or other official documents')}</li>
                                      </ul>
                                    </li>
                                    <li>{t('address.Additional document must be not more than 6 months old')}</li>
                                  </ol>
                                </Grid.Column>
                                <Grid.Column width={16}>
                                  {
                                    touched.fileAddrResult && errors.fileAddrResult
                                      ? (
                                        <Message error visible>
                                          {errors.fileAddrResult}
                                        </Message>
                                      )
                                      : fileAddr.map(file => (
                                        <div>
                                          <span>&#10004; {`${file.name}`}</span>
                                          <Icon link name="close" onClick={this.handleFileDelete(file)} />
                                        </div>
                                      ))
                                  }
                                </Grid.Column>
                                <Grid.Column width={16}>
                                  <Input
                                    type="hidden"
                                    name="fileAddrResult"
                                  />
                                  <Field
                                    file
                                    id="adr"
                                    name="fileAddr"
                                    onChange={this.handleFileUpload}
                                    disabled={fileAddr.length >= MAX_COUNT_ADDR}
                                  />
                                </Grid.Column>
                                <Grid.Column width={16}>
                                  <StyledDiv>
                                    <StyledLabel>
                                      {t('address.photos.Submitted photos must adhere to the following requirements')}
                                    </StyledLabel>
                                    <ul className="list-group">
                                      <li className="list-group-item">{t('address.photos.Photos must depict account owner')}</li>
                                      <li className="list-group-item">{t('address.photos.Resolution must be no less than 600x600 pixels')}</li>
                                      <li className="list-group-item">{t('address.photos.Photos must be crisp, not blurred')}</li>
                                      <li className="list-group-item">
                                        {t('address.photos.No part of your documents must be covered or obscured by fingers')}
                                      </li>
                                      <li className="list-group-item">{t('address.photos.All the data must be clearly visible')}</li>
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
                                addressFile && (
                                  <Grid.Column mobile={16} tablet={firstImageWidth} computer={firstImageWidth}>
                                    <Image
                                      src={addressFile}
                                      loading={loading}
                                    />
                                  </Grid.Column>
                                )
                              }
                              {
                                addressFile2 && (
                                  <Grid.Column mobile={16} tablet={8} computer={8}>
                                    <Image
                                      src={addressFile2}
                                      loading={loading}
                                    />
                                  </Grid.Column>
                                )
                              }
                            </Grid>
                          )
                      }
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

export const AddressVerificationFormTranslated = translate('common')(FormHOC(AddressFormFormik(AddressForm)));
