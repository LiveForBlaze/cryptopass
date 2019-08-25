// @flow
import React, { Component } from 'react';
import { Menu, Dropdown, Image } from 'semantic-ui-react';
import styled from 'styled-components';
import { Meteor } from 'meteor/meteor';
import { translate } from 'react-i18next';
import { Link } from 'react-router-dom';
import { devprint } from '../../../api/helpers';
import { languageList } from './Forms/molecules/language-list';

const StyledMenu = styled(Menu)`
  &.ui.menu {
    width: 100vw;
    height: 50px;
    background: #1d232c;
    border-width: 0;
    box-shadow: none;
    margin-bottom: 30px;
    border-radius: 0;

    .item {
      color: #fff;
      height: 50px;
    }

    .item:nth-last-child(1) {
      margin-right: 20px;
      margin-left: -10px;
    }
    .item:nth-last-child(3) {
      margin-right: -20px;
    }
    .item .links {
      display: inline-block;
      margin-left: 15px;
    }

    .item:hover,
    .item.active,
    .item.active:hover {
      color: #fff;
      background-color: transparent;
    }

    .item:before {
      display: none;
    }

    .ui.dropdown .menu:not(.visible) {
      display: none;
    }
  }
`;

const StyledLinksBlock = styled.div`
  @media only screen and (max-width: 768px) {
    display: none;
  }
`;

const StyledDots = styled.div`
  display: none;
  margin-right: -30px;
  @media only screen and (max-width: 768px) {
    display: block;
  }
`;

type Props = {
  t?: Object,
};

export class UserInterfaceMenu extends Component<Props> {
  static defaultProps = {
    t: null,
  };

  handleOnSelectLanguage = (e, { value }) => {
    window.localStorage.setItem('locale', value);
    this.props.i18n.changeLanguage(value);
    devprint(`Language selected: ${value}`);
  };

  userDropdownTrigger = (
    <span>
      <Image avatar src="http://via.placeholder.com/350x150" />
    </span>
  );

  logoutHandle = () => {
    Meteor.logout();
  }

  render() {
    const { t, user } = this.props;
    const locale = window.localStorage.locale || 'en';

    return (
      <StyledMenu>
        <Menu.Item header>
          <a className="text-white" href="https://cryptopass.id/" target="_blank" rel="noopener noreferrer">Cryptopass</a>
        </Menu.Item>
        {
          user &&
          <Menu.Item position="right">
            <StyledLinksBlock>
              <div className="links">
                <Link to="/" href="/">{t('navbar.Create Cryptopass')}</Link>
              </div>
              <div className="links">
                <Link to="/upload" href="/upload">{t('navbar.Upload Cryptopass')}</Link>
              </div>
              <div className="links">
                <Link to="/blockchainlogs" href="/blockchainlogs">{t('navbar.Blockchain Logs')}</Link>
              </div>
            </StyledLinksBlock>
          </Menu.Item>
        }
        <Menu.Menu position="right">
          <StyledDots>
            <Dropdown
              item
              icon="ellipsis horizontal"
              openOnFocus={false}
            >
              <Dropdown.Menu>
                <Dropdown.Item>
                  <Link to="/" href="/">{t('navbar.Create Cryptopass')}</Link>
                </Dropdown.Item>
                <Dropdown.Item>
                  <Link to="/upload" href="/upload">{t('navbar.Upload Cryptopass')}</Link>
                </Dropdown.Item>
                <Dropdown.Item>
                  <Link to="/blockchainlogs" href="/blockchainlogs">{t('navbar.Blockchain Logs')}</Link>
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </StyledDots>
          <Dropdown
            item
            direction="right"
            text={t('lng')}
            options={languageList}
            defaultValue={locale}
            onChange={this.handleOnSelectLanguage}
            openOnFocus={false}
          />
          {
            user &&
            <Dropdown
              item
              direction="right"
              // trigger={this.userDropdownTrigger}
              icon="user"
              openOnFocus={false}
            >
              <Dropdown.Menu>
                <Dropdown.Header content={user.username} />
                <Dropdown.Item text={t('interface.Profile')} />
                <Dropdown.Item text={t('interface.Logout')} onClick={this.logoutHandle} />
              </Dropdown.Menu>
            </Dropdown>
          }
        </Menu.Menu>
      </StyledMenu>
    );
  }
}

export const UserInterfaceMenuTranslated = translate('common')(UserInterfaceMenu);
