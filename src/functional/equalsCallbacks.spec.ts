import {byRef} from "./equalsCallbacks";

describe("byRef", function () {
  describe("when arguments are equal by reference", function () {
    it("should return true", function () {
      expect(byRef(1, 1)).toBe(true);
      const obj = {};
      expect(byRef(obj, obj)).toBe(true);
    });
  });

  describe("when arguments are not equal by reference", function () {
    it("should return true", function () {
      expect(byRef(1, 0)).toBe(false);
      expect(byRef({}, {})).toBe(false);
    });
  });
});
