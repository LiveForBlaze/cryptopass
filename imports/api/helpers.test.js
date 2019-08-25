/* eslint-disable no-console,fp/no-mutation */
import { devprint } from './helpers';

import Env from './env';

jest.mock('../../../api/env');

/* eslint-disable immutable/no-mutation */
describe('devprint', () => {
  console._log = console.log;
  console.log = jest.fn();
  it('prints to console in Dev env', () => {
    Env.isDev = true;
    devprint('bentley');
    expect(console.log).toHaveBeenCalledWith('bentley');
  });

  console.log = console._log;
  console.log = jest.fn();
  it('doesnt print to console not in Dev env', () => {
    Env.isDev = false;
    devprint('azure');
    expect(console.log).not.toHaveBeenCalled();
  });
});
