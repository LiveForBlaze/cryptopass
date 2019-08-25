// @flow
import React from 'react';
import whyDidYouUpdate from 'why-did-you-update';
import Env from '../../../api/env';

/**
 * @description: Prints to console when unnecessary re-renders happen; dev-mode only
 * @exampleInput: n\a
 * @exampleOutput: n\a
 * @pure: false: prints to console
 * @hasTests: false
 */
export function watchUnnecRerendersAndPrintToConsole(): void {
  if (Env.isDev) {
    // $FlowFixMe
    whyDidYouUpdate(React);
  }
}
