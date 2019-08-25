// @flow
import React, { Component } from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { I18nextProvider } from 'react-i18next';
import i18next from 'i18next';
import LngDetector from 'i18next-browser-languagedetector';
import { ErrorBoundary } from '../../init/misc/react-error-boundary';
import { Users } from '../../../api/collections';
import { UserInterfaceTranslated } from './UserInterface';
import { UploadCryptopassInterfaceTranslated } from './UploadCryptopassInterface';
import { BlockchainLogsTranslated } from './BlockchainLogs';
import { CryptopassView } from './CryptopassView';
import { CryptopassValidation } from './CryptopassValidation';
import { VerifyEmail } from './VerifyEmail';
import { CryptopassList } from './CryptopassList';
import { PasswordRecoveryWrapperTranslated } from './Forms/login-signup/PasswordRecoveryWrapper';
import { UserInterfaceMenuTranslated } from './UserInterfaceMenu';

import commonRu from '../../../translations/ru.json';
import commonEn from '../../../translations/en.json';
import commonCn from '../../../translations/cn.json';
import commonDe from '../../../translations/de.json';

Router.configure({
  noRoutesTemplate: true,
});

i18next
  .use(LngDetector)
  .init({
    detection: {
      // order and from where user language should be detected
      order: ['customDetector', 'querystring', 'cookie', 'localStorage', 'navigator', 'htmlTag'],
      lookupQuerystring: 'lng',
      lookupCookie: 'i18next',
      lookupLocalStorage: 'i18nextLng',
      lookupFromPathIndex: 0,
      lookupFromSubdomainIndex: 0,
      caches: ['localStorage', 'cookie'],
      excludeCacheFor: ['cimode'], // languages to not persist (cookie, localStorage)
    },
    interpolation: { escapeValue: false }, // React already does escaping
    resources: {
      en: {
        common: commonEn, // "common" is our custom namespace
      },
      ru: {
        common: commonRu,
      },
      cn: {
        common: commonCn,
      },
      de: {
        common: commonDe,
      },
    },
  });

function userInterfaceHOC(WrappedComponent) {
  return class Container extends Component {
    constructor(props) {
      super(props);

      this.state = {
        isAdmin: false,
      };
    }

    handleOnAdmin = () => {
      const { isAdmin } = this.state;
      this.setState({ isAdmin: !isAdmin });
    };

    render() {
      const props = {
        user: Meteor.user(),
        data: Users.find({}).fetch(),
        onAdmin: this.handleOnAdmin,
        isAdmin: this.state.isAdmin,
      };

      return <WrappedComponent {...props} />;
    }
  };
}
const InterfaceMenu = userInterfaceHOC(UserInterfaceMenuTranslated);
const PrimaryLayout = () => (
  <div style={{ height: '100%' }}>
    <InterfaceMenu />
    <Route exact path="/" component={userInterfaceHOC(UserInterfaceTranslated)} />
    <Route exact path="/upload" component={userInterfaceHOC(UploadCryptopassInterfaceTranslated)} />
    <Route exact path="/blockchainlogs" component={userInterfaceHOC(BlockchainLogsTranslated)} />
    <Route exact path="/verify-email/:token" component={VerifyEmail} />
    <Route path="/password-recovery" component={PasswordRecoveryWrapperTranslated} />
    <Route exact path="/reset-password/:token" component={PasswordRecoveryWrapperTranslated} />
    <Route exact path="/cryptopass-list" component={userInterfaceHOC(CryptopassList)} />
    <Route exact path="/view" component={userInterfaceHOC(CryptopassView)} />
    <Route exact path="/view/:userId" component={userInterfaceHOC(CryptopassView)} />
    <Route exact path="/check" component={userInterfaceHOC(CryptopassValidation)} />
    <Route exact path="/check/:userId" component={userInterfaceHOC(CryptopassValidation)} />
  </div>
);

class App extends React.Component {
  shouldComponentUpdate(nextProps) {
    return !this.props.currentUser || !nextProps.currentUser;
  }

  render() {
    return (
      <ErrorBoundary>
        <I18nextProvider i18n={i18next}>
          <div>
            <BrowserRouter>
              <div>
                <Route exact path="/api/check" />
                <Route>
                  <PrimaryLayout />
                </Route>
              </div>
            </BrowserRouter>
          </div>
        </I18nextProvider>
      </ErrorBoundary>
    );
  }
}

// todo-2: write e2e tests

export default withTracker(() => {
  Meteor.subscribe('users').ready();

  return {
    users: Users.find({}).fetch(),
    currentUser: Meteor.user(),
  };
})(App);
