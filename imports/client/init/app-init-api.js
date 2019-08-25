/* eslint-disable fp/no-nil, global-require */
// @flow
import { devprint } from '../../api/helpers';

export function initUserInterface() {
  require('./component-libs-css-imports/css-imorts');
  devprint('UI initialized', 1);
}

export function renderApp(): string {
  require('./platform-specific/meteor-init');
  return devprint('Rendering complete', 1);
}
