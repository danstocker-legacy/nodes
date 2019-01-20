import {TEqualityCallback} from "../nodes/basic";
import * as equal from "./equal";

describe("equal", function () {
  describe("property", function () {
    describe("when callback is specified", function () {
      let cb: TEqualityCallback<number>;

      beforeEach(function () {
        cb = (a, b) => a % 2 === b % 2;
      });

      describe("when properties match", function () {
        it("should return true", function () {
          expect(equal.createProperty("foo", cb)({foo: 3}, {foo: 1})).toBe(true);
        });
      });

      describe("when properties don't match", function () {
        it("should return false", function () {
          expect(equal.createProperty("foo", cb)({foo: 2}, {foo: 1})).toBe(false);
          expect(equal.createProperty("foo", cb)({}, {foo: 1})).toBe(false);
        });
      });

      describe("when either argument is undefined", function () {
        it("should return undefined", function () {
          expect(equal.createProperty("foo", cb)(undefined, {foo: 1})).toBeUndefined();
          expect(equal.createProperty("foo", cb)({foo: 1}, undefined)).toBeUndefined();
        });
      });
    });

    describe("when callback is not specified", function () {
      describe("when properties match", function () {
        it("should return true", function () {
          expect(equal.createProperty("foo")({foo: 1}, {foo: 1})).toBe(true);
        });
      });

      describe("when properties don't match", function () {
        it("should return false", function () {
          expect(equal.createProperty("foo")({foo: 2}, {foo: 1})).toBe(false);
          expect(equal.createProperty("foo")({}, {foo: 1})).toBe(false);
        });
      });

      describe("when either argument is undefined", function () {
        it("should return undefined", function () {
          expect(equal.createProperty("foo")(undefined, {foo: 1})).toBeUndefined();
          expect(equal.createProperty("foo")({foo: 1}, undefined)).toBeUndefined();
        });
      });
    });
  });
});
