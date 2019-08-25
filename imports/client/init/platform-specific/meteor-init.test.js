import { Meteor } from 'meteor/meteor';
// import {Tracker} from "meteor/tracker";

describe('If app is based on Meteor framework', () => {
  test('Meteor obj sd be importable', () => {
    expect(typeof Meteor).toBe('object');
  });
  // todo-1: jest-meteor-stubs doesnt have Tracker stub yet
  // https://github.com/orangecms/jest-meteor-stubs/issues/8
  // test("Tracker obj sd be importable", () => {
  // expect(typeof Tracker).toBe("object");
  // });
});
