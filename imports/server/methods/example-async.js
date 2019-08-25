// @flow
import { Meteor } from 'meteor/meteor';

Meteor.methods({
  /**
   * @description:
   * @exampleInput:
   * @exampleOutput:
   * @pure: false: accepts random files
   * @hasPassingTests: false
   */
  // indicate whether function is pure and has tests; delete this line
  async example_async(int) {
    function myAsyncFunc(x) {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(x * 2);
        }, 50);
      });
    }

    const interimResult = await myAsyncFunc(int);
    // Should return 10 times the integer that was sent from the client
    return interimResult * 10;
  },
});
