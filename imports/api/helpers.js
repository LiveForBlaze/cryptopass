// @flow
import Env from './env';

/**
 * @description: Prints to console in dev environment; accepts optional indents
 * @exampleInput: 'foo', 1
 * @exampleOutput: console.log('foo')
 * @pure: false: depends on Env, prints to console
 * @hasTests: false
 */
export function devprint(textToPrint: string | Object, indentsNum?: number): string | Object {
  if (Env.isDev) {
    // We want objects to be inspectable in the console, not have '[object Object]' string
    if (typeof textToPrint === 'object') {
      // eslint-disable-next-line no-console
      console.log(textToPrint);
    } else {
      const tabs = indentsNum ? ' '.repeat(indentsNum) : '';
      // eslint-disable-next-line no-console
      console.log(tabs + textToPrint);
    }
    return textToPrint;
  }
  return '';
}
// Make devprint global for ease of debugging - no need to import explicitly
// eslint-disable-next-line immutable/no-mutation,fp/no-this,fp/no-mutation
this.devprint = devprint;
