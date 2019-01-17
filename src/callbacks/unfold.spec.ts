import {TUnfolderCallback} from "../nodes/basic";
import * as unfold from "./unfold";

describe("unfold", function () {
  describe("pop()", function () {
    it("should unfold array", function () {
      const iterator = unfold.pop([1, 2, 3]);
      expect([...iterator]).toEqual([3, 2, 1]);
    });

    it("should leave original input intact", function () {
      const array = [1, 2, 3];
      const iterator = unfold.pop(array);
      for (const item of iterator) {
        //
      }
      expect(array).toEqual([1, 2, 3]);
    });
  });

  describe("shift()", function () {
    it("should unfold array", function () {
      const iterator = unfold.shift([1, 2, 3]);
      expect([...iterator]).toEqual([1, 2, 3]);
    });

    it("should leave original input intact", function () {
      const array = [1, 2, 3];
      const iterator = unfold.shift(array);
      for (const item of iterator) {
        //
      }
      expect(array).toEqual([1, 2, 3]);
    });
  });

  describe("split$()", function () {
    it("should return string fragments", function () {
      const split = unfold.split$("\n");
      const iterable = split("foo\nbar\nbaz");
      expect([...iterable]).toEqual(["foo", "bar"]);
    });

    describe("on subsequent calls", function () {
      let split: TUnfolderCallback<string, string>;
      let iterable: IterableIterator<string>;

      beforeEach(function () {
        split = unfold.split$("\n");
        iterable = split("foo\nba");
        for (const item of iterable) {
          //
        }
      });

      it("should preserve fragment", function () {
        iterable = split("r\nbaz");
        expect([...iterable]).toEqual(["bar"]);
      });
    });
  });
});
