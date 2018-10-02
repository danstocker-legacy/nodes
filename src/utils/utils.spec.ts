import {shallowCopy} from "./utils";

describe("shallowCopy()", function () {
  describe("for array", function () {
    it("should return copy array", function () {
      const value = [1, 2, 3];
      expect(shallowCopy(value)).not.toBe(value);
      expect(shallowCopy(value)).toEqual([1, 2, 3]);
    });
  });
});
