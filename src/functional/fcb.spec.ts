import {fcb} from "./fcb";
import {FilterCallback} from "./FilterCallback";

describe("change()", function () {
  let callback: FilterCallback<number>;

  beforeEach(function () {
    callback = fcb.change();
    callback(1);
  });

  describe("when next item is equivalent", function () {
    it("should return false", function () {
      expect(callback(1)).toBe(false);
    });
  });

  describe("when next item is non-equivalent", function () {
    it("should return true", function () {
      expect(callback(2)).toBe(true);
    });
  });
});
