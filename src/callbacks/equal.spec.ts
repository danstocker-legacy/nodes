import {equal} from "./equal";

describe("equal", function () {
  describe("reference", function () {
    describe("when arguments are equal by reference", function () {
      it("should return true", function () {
        expect(equal.reference(1, 1)).toBe(true);
        const obj = {};
        expect(equal.reference(obj, obj)).toBe(true);
      });
    });

    describe("when arguments are not equal by reference", function () {
      it("should return false", function () {
        expect(equal.reference(1, 0)).toBe(false);
        expect(equal.reference({}, {})).toBe(false);
      });
    });
  });

  describe("property", function () {
    describe("when properties match", function () {
      it("should return true", function () {
        expect(equal.property("foo")({foo: 1}, {foo: 1})).toBe(true);
      });
    });

    describe("when properties don't match", function () {
      it("should return false", function () {
        expect(equal.property("foo")({foo: 2}, {foo: 1})).toBe(false);
        expect(equal.property("foo")({}, {foo: 1})).toBe(false);
      });
    });

    describe("when either argument is undefined", function () {
      it("should return false", function () {
        expect(equal.property("foo")(undefined, {foo: 1})).toBeUndefined();
        expect(equal.property("foo")({foo: 1}, undefined)).toBeUndefined();
      });
    });
  });
});
