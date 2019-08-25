// @flow
import React from 'react';
import { translate } from 'react-i18next';
import { PasswordRecoveryTranslated } from './PasswordRecovery';
import { ResetPasswordTranslated } from './ResetPassword';

class PasswordRecoveryWrapper extends React.PureComponent {
  render() {
    const data = this.props;
    return (
      <div className="UserInterface">
        {
          data.match.params.token === undefined ? (
            <PasswordRecoveryTranslated />
          )
          : (
            <ResetPasswordTranslated token={data.match.params.token} />
          )
        }

      </div>
    );
  }
}

export const PasswordRecoveryWrapperTranslated = translate('common')(PasswordRecoveryWrapper);
