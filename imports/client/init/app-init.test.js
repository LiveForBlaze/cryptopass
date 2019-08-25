describe('middleware API', () => {
  it('can initialize the App', () => {
    expect(Middleware).toHaveProperty('initializeTheApp');
  });
  it('can add features to the App', () => {
    expect(Middleware).toHaveProperty('add_tf_Features_to_the_App');
  });
});
