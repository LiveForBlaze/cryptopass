//todo-2: split module.exports obj to conditionally add meteor-related jest config..
// (all the stuff below 'coverageDirectory') - if App.clientFramework = 'meteor'

const configObj = {
  bail: false,
  verbose: true,
  coverageDirectory: 'tests/coverage',
  //jest-meteor-stubs stuff; seems to be not needed
  // transform: {
  // 	'^.+\\.jsx?$': 'babel-jest',
  // },
  //jest-meteor-stubs stuff; seems to be not needed
  // moduleFileExtensions: [
  // 	'js',
  // 	'jsx',
  // ],
  modulePaths: [
    //jest-meteor-stubs stuff; seems to be not needed
    // '<rootDir>/node_modules/',
    //jest-meteor-stubs stuff; is needed
    '<rootDir>/node_modules/jest-meteor-stubs/lib/',
  ],
  moduleNameMapper: {
    // This is for jest to not throw on css modules imports
    "\\.(css|less)$": "identity-obj-proxy",
    //jest-meteor-stubs stuff; seems to be not needed
    // 	'^(.*):(.*)$': '$1_$2',
  },
  //jest-meteor-stubs stuff; seems to be not needed
  // unmockedModulePathPatterns: [
  // 	'/^imports\\/.*\\.jsx?$/',
  // 	'/^node_modules/',
  // ],
};
// eslint-disable-next-line immutable/no-mutation
module.exports = configObj;
