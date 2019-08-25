// @flow
import { devprint } from '../../api/helpers';
import { initUserInterface, renderApp } from './app-init-api';

export function prepareUserInterface(): string {
  initUserInterface();
  return devprint('UI konstructed');
}

export function initializeTheApp(): string {
  renderApp();
  return devprint('App is live!');
}
