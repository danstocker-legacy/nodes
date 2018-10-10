import {ccb} from "./ccb";

describe("ccb", function () {
  describe("intrinsic()", function () {
    describe("when a > b", function () {
      it("should return 1", function () {
        expect(ccb.intrinsic(2, 1)).toBe(1);
      });
    });

    describe("when a < b", function () {
      it("should return -1", function () {
        expect(ccb.intrinsic(1, 2)).toBe(-1);
      });
    });

    describe("when a equals b", function () {
      it("should return 0", function () {
        expect(ccb.intrinsic(1, 1)).toBe(0);
      });
    });

    describe("when a is not comparable to b", function () {
      it("should return undefined", function () {
        expect(ccb.intrinsic({}, {})).toBeUndefined();
      });
    });
  });
});
