import {TUnfolderCallback} from "../nodes/lang/Unfolder";
import {unfold} from "./unfold";

describe("unfold", function () {
  describe("split$", function () {
    it("should return string fragments", function () {
      const lineSplit = unfold.split$("\n");
      expect(lineSplit("foo\nbar\nbaz", 0)).toEqual({
        curr: "bar\nbaz",
        done: false,
        next: "foo"
      });
    });

    describe("on subsequent calls", function () {
      let lineSplit: TUnfolderCallback<string, string>;

      beforeEach(function () {
        lineSplit = unfold.split$("\n");
        lineSplit("foo\nba", 0);
        lineSplit("ba", 1);
      });

      it("should preserve fragment", function () {
        expect(lineSplit("r\nbaz", 2)).toEqual({
          curr: "baz",
          done: false,
          next: "bar"
        });
      });
    });
  });
});
