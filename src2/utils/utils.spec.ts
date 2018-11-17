import {copy} from "./utils";

describe("utils", function () {
  describe("copy()", function () {
    describe("for array", function () {
      it("should return copy array", function () {
        const value = [1, 2, 3];
        expect(copy(value)).not.toBe(value);
        expect(copy(value)).toEqual(value);
      });
    });

    describe("for object", function () {
      it("should return copy object", function () {
        const value = {foo: 1, bar: 2};
        expect(copy(value)).not.toBe(value);
        expect(copy(value)).toEqual(value);
      });
    });

    describe("for primitives", function () {
      it("should return input", function () {
        expect(copy(1)).toBe(1);
        expect(copy("foo")).toBe("foo");
        expect(copy(true)).toBe(true);
        expect(copy(null)).toBe(null);
      });
    });
  });
});
