import Env from './env';

describe('Env API', () => {
  it('provides Env object via default export', () => {
    expect(typeof Env).toBe('object');
  });

  it('can determine if current environment is development', () => {
    expect(Env).toHaveProperty('isDev');
  });

  it('can determine if current environment is production', () => {
    expect(Env).toHaveProperty('isProd');
  });

  it('can determine if current environment is Client', () => {
    expect(Env).toHaveProperty('isClient');
  });

  it('can determine if current environment is Server', () => {
    expect(Env).toHaveProperty('isServer');
  });
});
