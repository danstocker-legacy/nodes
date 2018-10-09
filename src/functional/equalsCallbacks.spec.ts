import {reference} from "./equalsCallbacks";

describe("reference", function () {
  describe("when arguments are equal by reference", function () {
    it("should return true", function () {
      expect(reference(1, 1)).toBe(true);
      const obj = {};
      expect(reference(obj, obj)).toBe(true);
    });
  });

  describe("when arguments are not equal by reference", function () {
    it("should return true", function () {
      expect(reference(1, 0)).toBe(false);
      expect(reference({}, {})).toBe(false);
    });
  });
});
