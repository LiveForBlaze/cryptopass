// @flow

/**
 * @description: Pipes a value supplied as arg 1 through a batch of functions supplied as args
 * from 2 to N
 * @exampleInput: n\a
 * @exampleOutput: n\a
 * @pure: false; calls indeterminate amount of supplied functions which are potentially impure
 * @hasTests: false
 */
// eslint-disable-next-line fp/no-rest-parameters
export function makeSentence(...args) {
  return args.reduce((result, func) => func(result));
}

export const and = x => x;
