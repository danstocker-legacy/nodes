import {intrinsic} from "./comparerCallbacks";

describe("intrinsic()", function () {
  describe("when a > b", function () {
    it("should return 1", function () {
      expect(intrinsic(2, 1)).toBe(1);
    });
  });

  describe("when a < b", function () {
    it("should return -1", function () {
      expect(intrinsic(1, 2)).toBe(-1);
    });
  });

  describe("when a equals b", function () {
    it("should return 0", function () {
      expect(intrinsic(1, 1)).toBe(0);
    });
  });

  describe("when a is not comparable to b", function () {
    it("should return undefined", function () {
      expect(intrinsic({}, {})).toBeUndefined();
    });
  });
});
