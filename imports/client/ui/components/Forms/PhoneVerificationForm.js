// @flow
import React, { Component } from 'react';
import classNames from 'classnames';
import { FormikConsumer } from 'formik';
import { translate } from 'react-i18next';
import { Form, Grid } from 'semantic-ui-react';
import { FormHOC } from './FormHOC';
import { Field } from './Field';
import { StyledSegment, StyledHeader } from './StyledFormComponents';
import { PhoneForm as PhoneFormFormik } from './formik-ui/PhoneForm';

class PhoneForm extends Component {
  static defaultProps = {
    editable: true,
    loading: false,
  };

  shouldComponentUpdate(nextProps) {
    const {
      userId,
      values,
      editable,
      loading,
      setValues,
      phone,
    } = nextProps;

    if (!userId) {
      return false;
    }

    if (!editable && !loading && loading !== this.props.loading) {
      setValues({
        ...values,
        phone,
      });
    }

    return true;
  }

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
              <StyledSegment padded id="step3">
                <Form onSubmit={handleSubmit} autoComplete="off">
                  <StyledHeader
                    as="h2"
                    className={classNames({
                      fade: !editable,
                    })}
                  >
                    {
                      editable
                        ? t('phone.Step 3 of 4 verify your phone number')
                        : t('phone.Verify your phone number')
                    }
                  </StyledHeader>
                  <Grid>
                    <Grid.Column width={16}>
                      <Field
                        label={t('phone.Phone number')}
                        name="phone"
                        placeholder={t('phone.Phone number')}
                        phone
                        editable={editable}
                        loading={loading}
                      />
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

export const PhoneVerificationFormTranslated = translate('common')(FormHOC(PhoneFormFormik(PhoneForm)));
